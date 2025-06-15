const mongoose = require('mongoose');
const { Schema } = mongoose;

const CartSchema = new Schema({
    cartId: {
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    field: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Field',
        required: true,
    },
});

module.exports = mongoose.model('Cart', CartSchema);

