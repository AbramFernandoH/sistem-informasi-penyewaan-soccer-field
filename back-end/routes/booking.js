require('dotenv').config();
const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Schedule = require('../models/schedule');
const Report = require('../models/report');
const Field = require('../models/field');
const Payment = require('../models/payment');
const { requireAuth} = require('../middleware');
const { nanoid } = require('nanoid')
const snap = require('../utils/midtrans')
const { sha512 } = require('js-sha512')
const { DateTime } = require('luxon')
const { timeSlots } = require("../utils/constants");
const { calculatePaymentAmount } = require("../utils/helper");

router.get('/', requireAuth('cms'), async (req, res) => {
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

router.get('/:bookingId', requireAuth('cms'), async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId).populate('payments field user')

        if (booking !== null) {
            return res.status(200).json({
                code: 200,
                success: true,
                message: 'OK',
                data: booking,
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
            message: 'Failed to get detail booking',
            data: null,
        });
    }
})

router.post('/add-registered-first-transaction', requireAuth('pwa'), async (req, res) => {
    try {
        const {
            name,
            email,
            telephoneNumber,
            orderDate,
            timeSlots,
            field,
            user,
            isUpfront,
        } = req.body;

        const orderId = `ORDER-${nanoid()}`;
        const selectedField = await Field.findById(field);
        const pricePerHour = selectedField !== null ? selectedField.pricePerHour : 0
        const price = Array.isArray(timeSlots)
            ? timeSlots.length * pricePerHour
            : pricePerHour;
        const firstTransactionPrice = isUpfront ? calculatePaymentAmount(orderDate, price) : price

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: firstTransactionPrice,
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
                    quantity: 1,
                    price: firstTransactionPrice,
                },
            ],
        };

        const transaction = await snap.createTransaction(parameter);

        // Simpan ke MongoDB
        const newBooking = await Booking.create({
            name,
            email,
            telephoneNumber,
            orderDate,
            timeSlots,
            price,
            field,
            user,
        });

        const firstPayment = await Payment.create({
            booking: newBooking._id,
            orderId,
            amount: firstTransactionPrice,
            status: 'pending',
            transactionTime: new Date(),
            user,
        })

        newBooking.payments.push(firstPayment._id);
        await newBooking.save();

        return res.status(200).json({
            code: 200,
            message: 'OK',
            success: true,
            data: {
                data: newBooking,
                redirect_url: transaction.redirect_url,
            },
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: true,
            message: 'Failed to create transaction',
            data: null,
        });
    }
})

router.post('/:bookingId/add-registered-second-transaction', requireAuth('cms'), async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        const {
            name,
            email,
            telephoneNumber,
            orderDate,
            user,
            price,
        } = booking;

        const orderId = `ORDER-${nanoid()}`;
        const secondTransactionPrice = price / 2

        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: secondTransactionPrice,
            },
            customer_details: {
                first_name: name,
                email,
                phone: telephoneNumber,
            },
            item_details: [
                {
                    id: 'futsal-booking',
                    name: `Booking Lapangan Futsal - ${orderDate.toISOString()}`,
                    quantity: 1,
                    price: secondTransactionPrice,
                },
            ],
        };

        const transaction = await snap.createTransaction(parameter);

        const secondPayment = await Payment.create({
            booking: booking._id,
            orderId,
            amount: secondTransactionPrice,
            status: 'pending',
            transactionTime: new Date(),
            user,
        })

        booking.payments.push(secondPayment._id);
        await booking.save()

        return res.status(200).json({
            code: 200,
            message: 'OK',
            success: true,
            data: {
                data: booking,
                redirect_url: transaction.redirect_url,
            },
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: true,
            message: 'Failed to add second transaction',
            data: null,
        });
    }
})

router.post('/add-guest-transaction', async (req, res) => {
    try {
        const {
            name,
            email,
            telephoneNumber,
            orderDate,
            timeSlots,
            field,
        } = req.body;

        const orderId = `ORDER-${nanoid()}`;
        const selectedField = await Field.findById(field);
        const pricePerHour = selectedField !== null ? selectedField.pricePerHour : 0
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
                    quantity: 1,
                    price: price,
                },
            ],
        };

        const transaction = await snap.createTransaction(parameter);

        // Simpan ke MongoDB
        const newBooking = await Booking.create({
            name,
            email,
            telephoneNumber,
            orderDate,
            timeSlots,
            price,
            field,
        });

        const payment = await Payment.create({
            booking: newBooking._id,
            orderId,
            amount: price,
            status: 'pending',
            transactionTime: new Date(),
        })

        newBooking.payments.push(payment._id);
        await newBooking.save();

        return res.status(200).json({
            code: 200,
            message: 'OK',
            success: true,
            data: {
                data: newBooking,
                redirect_url: transaction.redirect_url,
            },
        });
    } catch {
        return res.status(500).json({
            code: 500,
            success: true,
            message: 'Failed to create transaction',
            data: null,
        });
    }
})

router.post('/callback', async (req, res) => {
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
        const payment = await Payment.findOne({ orderId: order_id })

        if (payment !== null) {
            payment.status = 'success';

            await payment.save()
        }

        const booking = await Booking.findById(payment.booking).populate('field').populate('payments');

        const isFullyPaid = booking.price === Number(gross_amount) || booking.payments.map((payment) => payment.amount).reduce((acc, cur) => acc + cur) === booking.price
        const bookingStatus = isFullyPaid ? 'fully_paid' :  'half_paid'

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.status = bookingStatus;

        await booking.save();

        const formatedDate = DateTime.fromJSDate(booking.orderDate, { locale: 'id' })
            .toFormat('dd LLLL yyyy')

        const slots = booking.timeSlots
        const bookedSlots = slots.map(index => timeSlots[index]).join(', ')

        const rentInfo = `Sewa ${booking.field.name} oleh ${booking.name} - Tanggal ${formatedDate} - Jam ${bookedSlots}`

        await Schedule.create({
            reason: rentInfo,
            field: booking.field._id,
            date: booking.orderDate,
            timeSlots: slots,
            booking: booking._id,
        });

        await Report.create({
            name: rentInfo,
            type: 'income',
            totalPrice: booking.price,
            booking: booking._id,
        });
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
        const booking = await Booking.findOne({ 'payments.orderId': order_id })

        if (booking !== null && booking.price === Number(gross_amount)) {
            await Booking.deleteOne({ orderId: order_id });
            await Payment.deleteOne({ orderId: order_id });
        }
    }

    // always return 200 for midtrans callback
    return res.status(200).json({ message: 'Transaction status updated' });
})

module.exports = router;
