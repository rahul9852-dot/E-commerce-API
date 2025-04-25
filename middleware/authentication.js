const customError = require('../errors');
const {isTokenValid} = require('../utils');


const authenticatedUser = async(req, res, next)=>{

    const token = req.signedCookies.token;
    if(!token){
       throw new customError.UnauthenticatedError('Authentication invalid');
    }
    try{
        const {payload} = isTokenValid({token});
        const {name, userId, role} = payload;
        req.user = {name, userId, role};
        next();
    }catch(error){
        throw new customError.UnauthenticatedError('Authentication invalid');
    }
    
    
}


const authorizePermissions = (...roles) =>{   
    console.log(roles);
    return (req, res, next) =>{
    console.log(req.user.role);
        if(!roles.includes(req.user.role)){
            throw new customError.UnauthorizedError('Unauthorized to access this route');
        }
        next();
    }
}
module.exports = {
    authenticatedUser,
    authorizePermissions,
}
