const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const { requireAuth } = require('../middleware');

const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

router.get('/', requireAuth('cms'), async (req, res) => {
    try {
        const months = parseInt(req.query.months) || 3;

        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - months);
        startDate.setHours(0, 0, 0, 0);

        const now = new Date();

        // 1. Monthly Summary
        const monthlySummary = await Booking.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: startDate,
                        $lte: now
                    },
                    status: { $in: ['half_paid', 'fully_paid'] }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$orderDate" },
                        month: { $month: "$orderDate" }
                    },
                    totalRevenue: { $sum: "$price" },
                    totalBookings: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } }
        ]);

        const formattedMonthly = monthlySummary.map(entry => ({
            year: entry._id.year,
            month: entry._id.month,
            totalRevenue: entry.totalRevenue,
            totalBookings: entry.totalBookings
        }));

        // 2. Field Summary
        const fieldSummary = await Booking.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: startDate,
                        $lte: now
                    },
                    status: { $in: ['half_paid', 'fully_paid'] }
                }
            },
            {
                $group: {
                    _id: "$field",
                    bookingCount: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "fields",
                    localField: "_id",
                    foreignField: "_id",
                    as: "field"
                }
            },
            { $unwind: "$field" },
            {
                $project: {
                    _id: 0,
                    fieldId: "$field._id",
                    name: "$field.name",
                    bookingCount: 1
                }
            },
            { $sort: { name: 1 } }
        ]);

        // 3. Time Slot Usage by Day of Week
        const timeSlotData = await Booking.aggregate([
            {
                $match: {
                    orderDate: {
                        $gte: startDate,
                        $lte: now
                    },
                    status: { $in: ['half_paid', 'fully_paid'] }
                }
            },
            {
                $project: {
                    dayOfWeek: { $dayOfWeek: "$orderDate" }, // Sunday=1 ... Saturday=7
                    timeSlots: 1
                }
            },
            { $unwind: "$timeSlots" },
            {
                $group: {
                    _id: {
                        day: "$dayOfWeek",
                        slot: "$timeSlots"
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Build initial data structure
        const rawTimeSlotUsage = {};
        for (let i = 1; i <= 7; i++) {
            const dayName = daysOfWeek[i % 7]; // MongoDB's dayOfWeek starts at 1 (Sunday)
            rawTimeSlotUsage[dayName] = Array(15).fill(0);
        }

        for (const record of timeSlotData) {
            const dayName = daysOfWeek[record._id.day % 7];
            const slotIndex = record._id.slot;
            rawTimeSlotUsage[dayName][slotIndex] += record.count;
        }

        // Convert to array of objects
        const timeSlotUsage = Object.entries(rawTimeSlotUsage).map(([dayName, data]) => ({
            dayName,
            data
        }));

        return res.status(200).json({
            code: 200,
            message: 'OK',
            success: true,
            data: {
                monthlySummary: formattedMonthly,
                fieldSummary,
                timeSlotUsage
            },
        });
    } catch {
        return res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            success: false,
            data: null,
        });
    }
});

module.exports = router;
