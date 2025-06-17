const express = require('express');
const router = express.Router();
const Field = require('../models/field');
const Booking = require('../models/booking');
const Payment = require('../models/payment');
const Report = require('../models/report');
const Cart = require('../models/cart');
const Schedule = require('../models/schedule');
const { requireAuth } = require('../middleware');

router.get('/', requireAuth('cms'), async (req, res) => {
    try {
        const { skip } = req.query
        const currentSkip = skip ? Number(skip) : 0
        const listField = await Field.find({}).limit(10).skip(currentSkip);
        const totalField = await Field.countDocuments({});
        const metadata = {
            limit: 10,
            skip: currentSkip,
            count: totalField,
        };

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: {
                items: listField,
                metadata,
            },
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to get list user',
        });
    }
})

router.get('/:fieldId', requireAuth('cms'), async (req, res) => {
    try {
        const field = await Field.findById(req.params.fieldId);

        if (field !== null) {
            return res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data: field,
            });
        } else {
            return res.status(404).json({
                code: 404,
                message: 'Not found',
                success: false,
                data: null,
            });
        }
    } catch (err) {
        return res.status(500).json({
            code: 500,
            message: 'Failed to get detail field',
            success: false,
        });
    }
})

router.post('/add', requireAuth('cms'), async (req, res) => {
    try {
        const { name } = req.body;
        const existing = await Field.findOne({ name });

        if (existing) {
            return res.status(400).json({
                code: 400,
                success: false,
                message: 'Field name already exists',
                data: null,
            });
        } else {
            const data = await Field.create(req.body);

            return res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data,
            });
        }
    } catch {
        return res.status(500).json({
            code: 500,
            message: 'Failed to create field',
            success: false,
        });
    }
})

router.patch('/:fieldId/edit', requireAuth('cms'), async (req, res) => {
    try {
        const field = await Field.findById(req.params.fieldId);

        if (field !== null) {
            field.set(req.body);

            const data = await field.save();

            return res.status(200).json({
                code: 200,
                message: 'OK',
                success: true,
                data,
            });
        } else {
            return res.status(404).json({
                code: 404,
                message: 'Not found',
                success: false,
                data: null,
            });
        }
    } catch (err) {
        return res.status(500).json({
            code: 500,
            message: 'Failed to edit field',
            success: false,
        });
    }
})

router.delete('/:fieldId', requireAuth('cms'), async (req, res) => {
    const fieldId = req.params.fieldId;

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const futureBookings = await Booking.find({
            field: fieldId,
            orderDate: { $gt: today }
        });

        const futureBookingIds = futureBookings.map(b => b._id);

        const futurePayments = await Payment.find({
            booking: { $in: futureBookingIds }
        });

        // Update all successful payments to mark as manual refund required
        for (const payment of futurePayments) {
            if (payment.status === 'success') {
                await Payment.findByIdAndUpdate(payment._id, {
                    refundStatus: 'refunded_manually',
                    refundNote: 'Field deleted — manual refund required'
                });
            }
        }

        const paymentIdsToDelete = futurePayments.map(p => p._id);

        // only delete failed/pending
        await Payment.deleteMany({
            _id: { $in: paymentIdsToDelete },
            status: { $ne: 'success' }
        });

        await Report.deleteMany({ booking: { $in: futureBookingIds } });

        await Schedule.deleteMany({
            $or: [
                { booking: { $in: futureBookingIds } },
                { field: fieldId, date: { $gt: today } }
            ]
        });

        await Booking.deleteMany({ _id: { $in: futureBookingIds } });

        await Cart.deleteMany({ field: fieldId, orderDate: { $gt: today } });

        await Field.findByIdAndDelete(fieldId);

        return res.status(200).json({
            code: 200,
            message: 'OK',
            success: true,
            data: null,
        });
    } catch {
        return res.status(500).json({
            code: 500,
            message: 'Failed to delete field',
            success: false,
        });
    }
})

module.exports = router;
