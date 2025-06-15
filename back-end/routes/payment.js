const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Payment = require('../models/payment');
const { requireAuth } = require('../middleware');

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

module.exports = router;
