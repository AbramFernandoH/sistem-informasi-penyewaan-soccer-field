const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null,
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failure'],
        default: 'pending'
    },
    orderId: {
        type: String,
        required: true
    },
    transactionTime: {
        type: Date,
        required: true
    },
    refundStatus: {
        type: String,
        enum: ['not_requested', 'refunded_manually'],
        default: 'not_requested',
    },
    refundProof: {
        type: String, // file path or URL
        default: null
    },
    refundNote: {
        type: String,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
