const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const AdminUserSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
});

// adding username, hash and salt from original password
AdminUserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('AdminUser', AdminUserSchema);
