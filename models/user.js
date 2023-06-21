const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Username must be provided'],
        unique: true
    },
});

// plugin the passportLocalMongoose
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);