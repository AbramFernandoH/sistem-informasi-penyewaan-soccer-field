require('dotenv').config();
const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Schedule = require('../models/schedule');
const { requireAuth} = require('../middleware');
const { nanoid } = require('nanoid')
const snap = require('../utils/midtrans')
const { sha512 } = require('js-sha512')
const { DateTime } = require('luxon')
const { timeSlots } = require("../utils/constants");

router.get('/', async (req, res) => {
    try {
        const { skip } = req.query
        const currentSkip = skip ? Number(skip) : 0
        const listBooking = await Booking.find({}).limit(10).skip(currentSkip);
        const totalBooking = await Booking.countDocuments({});

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: {
                items: listBooking,
                metadata: {
                    limit: 10,
                    skip: currentSkip,
                    count: totalBooking,
                },
            },
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to get list booking',
            data: null,
        });
    }
})

router.post('/add', async (req, res) => {
    try {
        const {
            name,
            email,
            telephoneNumber,
            orderDate,
            timeSlots,
            field,
        } = req.body;

        const orderId = `BOOKING-${nanoid()}`;
        const pricePerHour = 100000;
        const price = Array.isArray(timeSlots)
            ? timeSlots.length * pricePerHour
            : pricePerHour;

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: price,
            },
            customer_details: {
                first_name: name,
                email,
                phone: telephoneNumber,
            },
            item_details: [
                {
                    id: 'futsal-booking',
                    name: `Booking Lapangan Futsal - ${orderDate}`,
                    quantity: Array.isArray(timeSlots) ? timeSlots.length : 1,
                    price: pricePerHour * timeSlots.length,
                },
            ],
        };

        const transaction = await snap.createTransaction(parameter);

        // Simpan ke MongoDB
        const newBooking = await Booking.create({
            orderId,
            name,
            email,
            telephoneNumber,
            orderDate,
            timeSlots,
            price,
            field,
            snapToken: transaction.token,
        });

        res.status(200).json({
            code: 200,
            message: 'OK',
            success: true,
            data: {
                data: newBooking,
                token: transaction.token,
                redirect_url: transaction.redirect_url,
            },
        });
    } catch {
        res.status(500).json({
            code: 500,
            success: true,
            message: 'Failed to create transaction',
            data: null,
        });
    }
})

router.post('/callback', async (req, res) => {
    try {
        const {
            order_id,
            status_code,
            gross_amount,
            signature_key,
            transaction_status,
            fraud_status,
        } = req.body;

        const serverKey = process.env.MIDTRANS_SERVER_KEY;

        const expectedSignature = sha512(order_id + status_code + gross_amount + serverKey)

        if (signature_key !== expectedSignature) {
            return res.status(403).json({ message: 'Invalid signature' });
        }

        if ((transaction_status === 'capture' && fraud_status === 'accept') || transaction_status === 'settlement') {
            const booking = await Booking.findOneAndUpdate(
                { orderId: order_id },
                { status: 'success' },
                { new: true }
            ).populate('field');

            const formatedDate = DateTime.fromJSDate(booking.orderDate, { locale: 'id' })
                .toFormat('dd LLLL yyyy')

            const slots = booking.timeSlots
            const bookedSlots = slots.map(index => timeSlots[index]).join(', ')

            await Schedule.create({
                reason: `Sewa ${booking.field.name} oleh ${booking.name} - Tanggal ${formatedDate} - Jam ${bookedSlots}`,
                field: booking.field._id,
                date: booking.orderDate,
                timeSlots: slots,
                booking: booking._id,
            });
        } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
            await Booking.deleteOne({ orderId: order_id });
        }

        return res.status(200).json({ message: 'Transaction status updated' });
    } catch {
        return res.status(500).json({ message: 'Server error' });
    }
})

router.patch('/:scheduleId/edit', requireAuth('cms'), async (req, res) => {
    try {
        const editedSchedule = await Booking.findById(req.params.scheduleId);

        if (editedSchedule !== null) {
            editedSchedule.set({
                ...editedSchedule,
                ...req.body,
            });

            const data = await editedSchedule.save();

            return res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data,
            });
        } else {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Not found',
                data: null,
            });
        }
    } catch {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to edit schedule',
            data: null,
        });
    }
})

router.delete('/:scheduleId', requireAuth('cms'), async (req, res) => {
    try {
        const schedule = await Booking.findById(req.params.scheduleId);

        if (schedule !== null) {
            await Booking.deleteOne({ _id: schedule._id });

            res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data: null,
            });
        } else {
            return res.status(404).json({
                code: 404,
                success: false,
                message: 'Not found',
                data: null,
            });
        }
    } catch (e) {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to delete schedule',
            data: null,
        });
    }
})

module.exports = router;
