const mongoose = require('mongoose');
const { Schema } = mongoose;

const FieldSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pricePerHour: {
        type: Number,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Field', FieldSchema);

