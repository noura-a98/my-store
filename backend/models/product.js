const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const { trim } = require('validator');

const productSchema = new mongoose.Schema({

    name: {
        type : String,
        required : [true,'Name is required.'],
        trim: true
    },
    description: {
        type : String,
        required : [true,'Description is required.'],
        trim: true

    },
    price : {
        type:Number,
        required : [true, 'Price is required.']
    },
    slug :{
        type : String,
    },
    stock : {
        type : Number 
    },
    images: [String],
    imageCover : {
        type : String,
        
    },
    createdAt : {
        type : Date,
        default : Date.now,
        select:false
    }
});

productSchema.pre('save' , function(next){
    this.slug = slugify(this.name,{lower:true});
    next();
})

const Product = mongoose.model('product',productSchema);
module.exports = Product;