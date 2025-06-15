const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReportSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        default: 'income',
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null,
    }
});

module.exports = mongoose.model('Report', ReportSchema);
