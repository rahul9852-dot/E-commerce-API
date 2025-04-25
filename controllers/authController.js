
const user = require('../model/user/user');
const {StatusCodes} = require('http-status-codes');
const {attchCookieToResponse, createTokenUser} = require('../utils');
const customError = require('../errors');

const register = async (req, res)=>{
    const {name, email, password} = req.body;
    const isFirstAccount = await user.countDocuments({}) === 0;
    const isAdmin = isFirstAccount ? 'admin' : 'user';
    const isEmailAlreadyExists = await user.findOne({email});
    if(isEmailAlreadyExists){
        throw new customError.BadRequestError('Email already exists');
    }
    const User = await user.create({name, email, password, role: isAdmin});
    const tokenUser = createTokenUser(User);
    attchCookieToResponse({res, user: tokenUser});
    res.status(StatusCodes.CREATED).json({user: tokenUser});
}

const login = async (req, res)=>{
    
    const {email, password} = req.body;
    if(!email || !password){
        throw new customError.BadRequestError('Please provide email and password');
    }
    const users = await user.findOne({email});
    console.log(users);
    if(!users){
        throw new customError.UnauthenticatedError('Invalid credentials');
    }
    const isPasswordCorrect = await users.comparePassword(password);
    if(!isPasswordCorrect){
        console.log('Check password is incorrect!!');
        throw new customError.UnauthenticatedError('Invalid credentials');
    }
    const tokenUser = createTokenUser(users);
    attchCookieToResponse({res, user: tokenUser});
    res.status(StatusCodes.CREATED).json({user: tokenUser});
}

const logout = async(req, res)=>{
    res.cookie('token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    })
    res.status(StatusCodes.OK).json({msg: 'user logged out!'});
}


module.exports = {
    register,
    login,
    logout
}