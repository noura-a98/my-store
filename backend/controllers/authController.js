const User = require('./../models/userModel');


exports.createAccount = async(req , res , next) => {
    const fnewUser = await User.create(req.body);

    res.status(201).json({
        status: 'sucess',
        data:{
            user : newUser
        } 
    })
}