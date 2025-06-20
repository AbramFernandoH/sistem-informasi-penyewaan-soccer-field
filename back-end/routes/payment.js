const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Payment = require('../models/payment');
const Report = require('../models/report');
const Schedule = require('../models/schedule');
const { requireAuth } = require('../middleware');
const snap = require('../utils/midtrans')
const mongoose = require('mongoose');

router.get('/:userId', requireAuth('pwa'), async (req, res) => {
    try {
        const { skip } = req.query
        const currentSkip = skip ? Number(skip) : 0
        const listPayment = await Payment.find({ user: req.params.userId }).limit(10).skip(currentSkip);
        const totalPayment = await Payment.countDocuments({});
        const metadata = {
            limit: 10,
            skip: currentSkip,
            count: totalPayment,
        };

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: {
                items: listPayment,
                metadata,
            },
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to get list payments',
        });
    }
})

router.get('/', requireAuth('cms'), async (req, res) => {
    try {
        const { skip, bookingId } = req.query;
        const currentSkip = skip ? Number(skip) : 0;

        const filter = {};

        if (bookingId) {
            if (!mongoose.Types.ObjectId.isValid(bookingId)) {
                return res.status(400).json({
                    code: 400,
                    success: false,
                    message: 'Invalid booking ID format',
                    data: null,
                });
            }

            filter.booking = bookingId;
        }

        const listPayment = await Payment.find(filter)
            .limit(10)
            .skip(currentSkip)
            .populate('booking user');

        const totalPayment = await Payment.countDocuments(filter);

        const metadata = {
            limit: 10,
            skip: currentSkip,
            count: totalPayment,
        };

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: {
                items: listPayment,
                metadata,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to get list payment',
        });
    }
});

router.post('/:paymentId/refund', async (req, res) => {
    const { paymentId } = req.params;
    const { refundNote = 'Refunded by admin', refundProof } = req.body;

    try {
        const payment = await Payment.findById(paymentId).populate('booking');
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        payment.set({
            ...payment,
            refundStatus: 'refunded_manually',
            refundProof,
            refundNote,
        })

        await payment.save();

        const booking = await Booking.findById(payment.booking._id).populate('payments');
        const allRefundedManually = booking.payments.every(p => p.toString() === paymentId || p.refundStatus === 'refunded_manually');
        if (allRefundedManually) {
            booking.status = 'failure';
            await booking.save();
        }

        await Report.create({
            name: `Refund for ${payment.orderId}`,
            type: 'expense',
            totalPrice: payment.amount,
            booking: booking._id
        });

        await Schedule.deleteOne({ booking: booking._id })

        return res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: null,
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: false,
            message: 'Failed to process refund',
        });
    }
});

module.exports = router;
