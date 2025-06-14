const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
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
    snapToken: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failure'],
        default: 'pending',
    },
    field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
