const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
    firstName : {
        type:String,
        required:[true, 'Please enter your first name.']
    },
    lastName : {
        type:String,
        required:[true, 'Please enter your last name.'],

    },
    email : {
        type: String,
        required:[true, 'Please enter your email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail,'Please provide a vaild email.']

    },
    phone : {
        type: String,
        required :[true,'Please enter you phone number.'],
    },
    role: {
        type: String,
        required:[true , 'Please select a role.'],
        enum:['admin' , 'driver']

    },
    password: {
        type : String,
        required:[true, 'please enter a password.'],
        minlength:8,
    },
    passwordConfirm: {
        type : String,
        required:[true , 'Please confirm your password.']
    },

});

const User = mongoose.model('User' , userSchema);

module.exports = User;