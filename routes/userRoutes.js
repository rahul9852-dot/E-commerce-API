const express = require('express');
const router = express.Router();


const {getAllUsers, getSingleUser, updateUser, updateUserPassword, showCurrentUser} = require('../controllers/userController');
const {authenticatedUser, authorizePermissions} = require('../middleware/authentication');

router.route('/').get(authenticatedUser, authorizePermissions('admin','owner'), getAllUsers);
router.route('/showMe').get(authenticatedUser, showCurrentUser);
router.route('/updateUser').patch( updateUser);
router.route('/updateUserPassword').patch(authenticatedUser, updateUserPassword);
router.route('/:id').get(authenticatedUser, getSingleUser);

module.exports = router;
