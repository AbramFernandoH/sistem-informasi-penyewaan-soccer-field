const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReportSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: Number,
        min: 1,
        max: 2,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Report', ReportSchema);
