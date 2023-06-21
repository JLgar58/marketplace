const passportLocalMongoose = require('passport-local-mongoose');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// const saltRounds = 12;

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Username must be provided'],
        unique: true
    },
    // username: {
    //     type: String,
    //     required: [true, 'Username must be provided'],
    // },
    // password: {
    //     type: String,
    //     required: [true, 'Passsowrd must be provided'],
    // },
});

// plugin the passportLocalMongoose
userSchema.plugin(passportLocalMongoose);

// hash middleware
// userSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password, saltRounds);
//     return next();
// });

// logged middleware
// userSchema.statics.findAndValidate = async function(username, password) {
//     const user = await this.findOne({ username });
//     const isValid = await bcrypt.compare(password, user.password);
//     return isValid ? user : false;
// }

module.exports = mongoose.model('User', userSchema);