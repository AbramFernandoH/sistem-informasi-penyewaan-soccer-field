const mongoose = require('mongoose');
const { Schema } = mongoose;

const ScheduleSchema = new Schema({
    field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlots: {
        type: [Number],
        min: 0,
        max: 15,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null,
    }
});

module.exports = mongoose.model('Schedule', ScheduleSchema);

