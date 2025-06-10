const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    fullName: {
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
});

// adding username, hash and salt from original password
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
