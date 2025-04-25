const mongoose = require('mongoose');


const singleCartItemSchema = new mongoose.Schema({
    name: {type:String, required: true},
    image: {type:String, required: true},
    price: {type:Number, required: true},
    amount: {type:Number, required: true},
    product: {type: mongoose.Schema.ObjectId, ref: 'Product', required: true},
})

const OrderSchema = new mongoose.Schema({
    tax : {type:Number, required: true},
    shippingFee: {type:Number, required: true},
    subtotal: {type:Number, required: true},
    total: {type:Number, required: true},
    orderItems: [singleCartItemSchema],
    status: {type:String, enum:['pending', 'failed', 'paid', 'delivered', 'cancelled']},
    user: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
    clientSecret: {type:String, required: true},
    paymentId: {type:String}
}, {timestamps: true});

OrderSchema.pre('save', async function(next){
    this.subtotal = this.orderItems.reduce((acc, item)=>{
        
    })
})

module.exports = mongoose.model('Order', OrderSchema);