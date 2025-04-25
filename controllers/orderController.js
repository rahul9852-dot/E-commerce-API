
const Order = require('../model/order');
const Product = require('../model/product');

const {StatusCodes} = require('http-status-codes');
const checkPermissions = require('../utils/checkPermissions');

const fakeStripePaymentAPI = ({amount, currency})=>{
    const clientSecret = 'someRandomValue';
    return {clientSecret, amount};
}

const createOrder =   async(req, res)=>{
    const {items: cartItems, tax, shippingFee} = req.body;

    if(!cartItems || cartItems.length < 1){
        throw new CustomError('Cart is empty', StatusCodes.BAD_REQUEST);
    }
    if(!tax || !shippingFee){
        throw new CustomError('Tax and shipping fee are required', StatusCodes.BAD_REQUEST);
    }

    let orderItems = [];
    let subtotal = 0;

    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id: item.product});
        if(!dbProduct){
            throw new CustomError(`No product with id: ${item.product}`, StatusCodes.BAD_REQUEST);
        }
        const {name, image, price, _id} = dbProduct;

        console.log(name, image, price, _id);
        const singleOrderItem = {
            amount: item.amount,
            name,
            price,
            image,
            product: _id
        }
        orderItems = [...orderItems, singleOrderItem];
        subtotal += item.amount * price;
        
    }
    const total = tax + shippingFee + subtotal;
    const paymentIntent = await fakeStripePaymentAPI({amount: total, currency: 'usd'});
    const order = await Order.create({
        orderItems,
        total,
        subtotal,
        tax,
        shippingFee,
        clientSecret: paymentIntent.clientSecret,
        user: req.user.userId
    })
    res.status(StatusCodes.CREATED).json({order, clientSecret: paymentIntent.clientSecret});
    
}

const getAllOrders = async(req, res)=>{
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({orders});
}   

const getSingleOrder = async(req, res)=>{
    const {id: orderId} = req.params;
    const order = await Order.findOne({_id: orderId});
    if(!order){
        throw new CustomError(`No order with id: ${orderId}`, StatusCodes.NOT_FOUND);
    }
    checkPermissions(req.user, order.user);
    res.status(StatusCodes.OK).json({order});
}

const updateOrder = async(req, res)=>{
   const {id: orderId} = req.params;
   const {paymentIntentId} = req.body;

   const order = await Order.findOne({_id: orderId});
   if(!order){
    throw new CustomError(`No order with id: ${orderId}`, StatusCodes.NOT_FOUND);
   }
   checkPermissions(req.user, order.user);
   order.paymentIntentId = paymentIntentId;
   order.status = 'paid';
   await order.save();
   res.status(StatusCodes.OK).json({order});
}

const deleteOrder = async(req, res)=>{
    const {id: orderId} = req.params;
    const order = await Order.findOne({_id: orderId});
    if(!order){
        throw new CustomError(`No order with id: ${orderId}`, StatusCodes.NOT_FOUND);
    }
    checkPermissions(req.user, order.user);
    await order.remove();
    res.status(StatusCodes.NO_CONTENT).send();
}

const getCurrentUserOrders = async(req, res)=>{
    const orders = await Order.find({user: req.user.userId});
    res.status(StatusCodes.OK).json({orders});
}

module.exports = {
    createOrder,
    getAllOrders,
    getSingleOrder,
    updateOrder,
    deleteOrder,
    getCurrentUserOrders
}