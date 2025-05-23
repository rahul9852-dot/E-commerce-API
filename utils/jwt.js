const jwt = require('jsonwebtoken');
const {StatusCodes} = require('http-status-codes');
const createJwt = ({payload})=>{
    const token = jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
    return token;
}

const isTokenValid = ({token})=>{
    return jwt.verify(token, process.env.JWT_SECRET);
}

const attchCookieToResponse = ({res, user})=>{
    const token = createJwt({payload: user});
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === 'production',
        signed: true,
    })
}
module.exports = {
    createJwt,
    isTokenValid,
    attchCookieToResponse
}

