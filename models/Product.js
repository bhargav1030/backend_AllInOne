const mongoose = require("mongoose");

const productSchema =new mongoose.Schema({
    productName:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require:true

    },
    category:{
        type:[{
            type:String,
            enum:["Food","Fruits","Electronics","provision","repair","Other"]
        }]
    },
    image:{
        type:String
    },
    description:{
        type:String
    },
    firm:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Firm'
    }]
});
const Product = mongoose.model('Product',productSchema);

module.exports =Product;