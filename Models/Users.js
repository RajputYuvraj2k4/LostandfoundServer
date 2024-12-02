const mongoose = require('mongoose');
const Schema = mongoose.Schema


const UserSchema = new Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contact: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }

});

const UserModel = mongoose.model('users',UserSchema);
module.exports = UserModel;


