const express = require('express');
const router = express.Router();
const {authenticatedUser} = require('../middleware/authentication');
const {createReview, getAllReviews, getSingleReview, updateReview, deleteReview, getSingleProductReviews} = require('../controllers/reviewController');

router
    .route('/')
    .post(authenticatedUser, createReview)
    .get(authenticatedUser, getAllReviews);

router
    .route('/:id')
    .get(getSingleReview)
    .patch(authenticatedUser, updateReview)
    .delete(authenticatedUser, deleteReview);

router
    .route('/product/:id')
    .get(getSingleProductReviews);

module.exports = router;