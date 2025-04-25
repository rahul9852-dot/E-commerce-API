const express = require('express');
const router = express.Router();
const {authenticatedUser, authorizePermissions} = require('../middleware/authentication');

const {createOrder, getAllOrders, getSingleOrder, updateOrder, deleteOrder, getCurrentUserOrders} = require('../controllers/orderController');

router.route('/').post(authenticatedUser, createOrder).get(authenticatedUser, authorizePermissions('admin'), getAllOrders);
router.route('/showAllMyOrders').get(authenticatedUser, getCurrentUserOrders);
router.route('/:id').get(authenticatedUser, getSingleOrder).patch(authenticatedUser, updateOrder).delete(authenticatedUser, deleteOrder);

module.exports = router;