
const User = require('../model/user/user');
const {StatusCodes} = require('http-status-codes');
const customError = require('../errors');
const { createTokenUser, attchCookieToResponse } = require('../utils');
const checkPermissions = require('../utils/checkPermissions');

const getAllUsers = async(req, res) =>{
    console.log(req.user);
    const user = await User.find({role:'user'}).select('-password');
    res.status(StatusCodes.OK).json({user});
   
}

const getSingleUser = async(req, res) =>{
    const user = await User.findOne({_id: req.params.id}).select('-password');
    if(!user){
        throw new customError.NotFoundError('User not found');
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({user});
}
const updateUser = async(req, res) =>{
    const {email, name} = req.body;
    if(!email || !name){
        throw new customError.BadRequestError('Please provide email and name');
    }
    const user = await User.findOneAndUpdate({email}, {name}, {new: true, runValidators: true});
    const tokenUser = createTokenUser(user);
    attchCookieToResponse({res, user: tokenUser});
    res.status(StatusCodes.OK).json({user});
}
const showCurrentUser = async(req, res) =>{
    res.status(StatusCodes.OK).json({user: req.user});
}
const updateUserPassword = async(req, res) =>{
    
    const {oldPassword, newPassword } = req.body;
    if(!oldPassword || !newPassword){
        throw new customError.BadRequestError('Please provide old and new password');
    }

    const user = await User.findOne({_id: req.user.userId});
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if(!isPasswordCorrect){
        throw new customError.UnauthenticatedError('Invalid credentials');
    }
    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({msg: 'Password updated successfully'});
}


module.exports = {getAllUsers, getSingleUser, updateUser, updateUserPassword, showCurrentUser};