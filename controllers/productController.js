const Product =require('../models/Product');
const multer = require('multer');
const Firm = require('../models/Firm')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }   
});
const  upload = multer({storage :storage});

const addProduct =async(req,res)=>{
    try {
        const {productName,price,category,description} = req.body;

        const image =req.file?req.file.filename:undefined;

        const firmId = req.params.firmId;
        const firm =await Firm.findById(firmId);
        
        if(!firm){
            res.status(404).json({error:"No firm found"});
        }
        const product = new Product({
            productName,price,category,image,description,firm:firm._id
        })

        const savedProduct =await product.save();

        firm.products.push(savedProduct);
        
        await firm.save();
        res.status(200).json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({error:'Internal server error'})
    }
}


const getProductByFirm = async(req,res)=>{
    const firmId = req.params.firmId
    const firm = await Firm.findById(firmId);

    if (!firm){
        res.status(404).json({error:"firm not found"})
    }
    const resturent =firm.firmName; 
    const products = await Product.find({firm : firmId});
    res.status(200).json({resturent , products})
}


const deleteProductById = async(req,res)=>{
    try {
        const productId = req.params.productId;

        const deleteproduct = await Product.findByIdAndDelete(productId);

        if (!deleteproduct){
            res.status(404).json({error:"product not found"})
        }


    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
}
module.exports ={addProduct:[upload.single('image'),addProduct],getProductByFirm ,deleteProductById};