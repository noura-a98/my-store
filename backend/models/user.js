const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
    userName : {
        type : String,
        required : [true,'Please enter the user name'],
        lowercase : true,
        unique : true
    },
    phone : {
        type: String,
        required :[true,'Please enter you phone number.'],
    },
    role: {
        type: String,
        required:[true , 'Please select a role.'],
        enum:['admin' , 'driver','influencer'],

    },
    password: {
        type : String,
        required:[true, 'please enter a password.'],
        minlength:8,
        select : false
    },
    passwordConfirm: {
        type : String,
        required:[true , 'Please confirm your password.'],
        validate: {
            // This only works on Save!! 
            validator: function(el) {
                return el === this.password;
            },
            message : 'Passwords are not the same!.'

        }
    },
    passwordChangedAt : Date,
    active: {
        type : Boolean,
        default : true,
        select : false
    }
});

userSchema.pre('save', async function(next) {
    // only run this function if password was actually modified
    if(!this.isModified('password')) return next();
    
    // hash the password with cost of 12
    this.password = await bcrypt.hash(this.password,12);
    
    // delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();

});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
){
    return await bcrypt.compare(candidatePassword,userPassword);

};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    console.log(changedTimestamp,JWTTimestamp)
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.pre(/^find/,function(next){
this.find({active:{$ne : false}});

next();
});
const User = mongoose.model('User', userSchema); // Capital 'U'
module.exports = User;
