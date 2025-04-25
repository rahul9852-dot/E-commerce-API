const {StatusCodes} = require('http-status-codes');
const customError = require('../errors');
const Product = require('../model/product');
const Review = require('../model/Review');
const {checkPermissions} = require('../utils/checkPermissions');



const createReview = async(req, res)=>{
    const { productId, rating, title, comment } = req.body;
    
    const isValidProduct = await Product.findOne({_id:productId});

    if(!isValidProduct){
        throw new customError.NotFoundError('Product not found');
    }

    const alreadySubmitted = await Review.findOne({
        user: req.user.userId,
        product: productId,
    });

    if(alreadySubmitted){
        throw new customError.BadRequestError('Already submitted a review for this product');
    }

    req.body.user = req.user.userId;
    req.body.product = productId;

    const review = await Review.create(req.body);
    
    res.status(StatusCodes.CREATED).json({ review });
}

const getAllReviews = async(req, res)=>{
    const reviews = await Review.find({});
    res.status(StatusCodes.OK).json({reviews});
}

const getSingleReview = async(req, res)=>{
    const {id:reviewId} = req.params;
    const review = await Review.findOne({_id:reviewId});

    if(!review){
        throw new customError.NotFoundError('Review not found');
    }

    res.status(StatusCodes.OK).json({review});
}

const updateReview = async(req, res)=>{
    const {id: reviewId} = req.params;
    const {rating, title, comment} = req.body;

    const review = await Review.findOne({_id:reviewId});

    if(!review){
        throw new customError.NotFoundError('Review not found');
    }

    checkPermissions(req.user, review.user);

    review.rating = rating;
    review.title = title;
    review.comment = comment;

    await review.save();

    res.status(StatusCodes.OK).json({review});
}

const deleteReview = async(req, res)=>{
    const {id: reviewId} = req.params;
    const review = await Review.findOne({_id:reviewId});

    if(!review){
        throw new customError.NotFoundError('Review not found');
    }

    checkPermissions(req.user, review.user);

    await review.remove();

    res.status(StatusCodes.OK).json({msg: 'Review deleted successfully'});
}

const getSingleProductReviews = async(req, res) =>{
    const {id:productId} = req.params;
    const reviews = await Review.find({product:productId});
    res.status(StatusCodes.OK).json({reviews, count:reviews.length});
}


module.exports = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
    getSingleProductReviews
}



