const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema({

    name:{
        type: String,
        require: [true, 'Please provide a name'],
        minlength: 3,
        maxlength: 50,
    },
    email:{
        type: String,
        unique: true,
        require: [true, 'Please provide a email'],
        validator:{
            validator: validator.isEmail,
            message: 'Please provide a valid email',
        }
    }, 
    password:{
        type: String,
        require: [true, 'Please provide a password'],
        minlength: 8,
    },
    role:{
        type: String,
        enum:['admin', 'user'],
        default: 'user',
    }
})


userSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}


module.exports = mongoose.model('User', userSchema);