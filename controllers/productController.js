const Product = require("../model/product");
const {StatusCodes} = require('http-status-codes');
const customError = require('../errors');
const path = require('path');

const createProduct = async(req, res)=>{
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product});
}

const getAllProducts = async(req, res)=>{
   const products = await Product.find({});
   res.status(StatusCodes.OK).json({products, count: products.length});
}

const getSingleProduct = async(req, res)=>{
  
    const {id: productId} = req.params;
    const product = await Product.findOne({_id: productId});
    if(!product){
        throw new customError.NotFoundError(`No product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({product});
}

const updateProduct = async(req, res)=>{
   const {id: productId} = req.params;
   const product = await Product.findOneAndUpdate({_id: productId}, req.body, {new: true, runValidators: true});
   if(!product){
    throw new customError.NotFoundError(`No product with id ${productId}`);
   }
   res.status(StatusCodes.OK).json({product});
}

const deleteProduct = async(req, res)=>{
    const {id: productId} = req.params;
    const product = await Product.findOne({_id: productId});
    if(!product){
        throw new customError.NotFoundError(`No product with id ${productId}`);
    }
    await product.remove();
    res.status(StatusCodes.NO_CONTENT).send('Product deleted successfully');
}

const uploadImage = async(req, res)=>{
    console.log(req.files);
    if(!req.files){
        throw new customError.BadRequestError('No file uploaded');
    }
    const productImage = req.files.image;
    if(!productImage.mimetype.startsWith('image')){
        throw new customError.BadRequestError('Please upload an image');
    }
    const maxSize = 1024 * 1024;
    if(productImage.size > maxSize){
        throw new customError.BadRequestError('Please upload an image smaller than 1MB');
    }
    const imagePath = path.join(__dirname, '../public/uploads/' + `${productImage.name}`);
    await productImage.mv(imagePath);
    res.status(StatusCodes.OK).json({image: `/uploads/${productImage.name}`});
}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadImage
}