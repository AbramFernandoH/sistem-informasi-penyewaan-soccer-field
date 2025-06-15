const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Payment = require('../models/payment');
const Report = require('../models/report');
const Schedule = require('../models/schedule');
const { requireAuth } = require('../middleware');
const snap = require('../utils/midtrans')

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
        const { skip } = req.query
        const currentSkip = skip ? Number(skip) : 0
        const listPayment = await Payment.find({}).limit(10).skip(currentSkip);
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
            message: 'Failed to get list payment',
        });
    }
})

router.post('/:paymentId/refund', async (req, res) => {
    const { paymentId } = req.params;
    const { reason = 'Refunded by admin' } = req.body;

    try {
        const payment = await Payment.findById(paymentId).populate('booking');
        if (!payment) return res.status(404).json({ error: 'Payment not found' });

        const refundResponse = await snap.transaction.refund(payment.orderId, {
            refund_key: `refund-${payment.orderId}-${Date.now()}`,
            amount: payment.amount,
            reason
        });

        payment.status = 'failure';
        await payment.save();

        const booking = await Booking.findById(payment.booking._id).populate('payments');
        const allFailed = booking.payments.every(p => p.toString() === paymentId || p.status === 'failure');
        if (allFailed) {
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

        res.status(200).json({
            code: 200,
            success: true,
            message: 'OK',
            data: refundResponse,
        });
    } catch (err) {
        console.error('Refund error:', err);
        res.status(500).json({ error: 'Failed to process refund', details: err.message });
    }
});

module.exports = router;
