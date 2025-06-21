const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telephoneNumber: {
        type: String,
        required: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    timeSlots: {
        type: [Number],
        min: 0,
        max: 15,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'half_paid', 'fully_paid', 'failure'],
        default: 'pending',
    },
    field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field',
        required: true,
    },
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null,
    },
    refundStatus: {
        type: String,
        enum: ['not_requested', 'refunded_manually'],
        default: 'not_requested',
    },
    refundProof: {
        type: String,
        default: null
    },
    refundNote: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
