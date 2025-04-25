const customError = require('../errors');

const checkPermissions = (requestedUser, resourceUserId) =>{
    if(requestedUser.role === 'admin'){
        return;
    }
    if(requestedUser.userId === resourceUserId.toString()){
        return;
    }
    throw new customError.UnauthorizedError('Not authorized to access this route');
    
    
}

module.exports = checkPermissions;