const Firm = require("../models/Firm");
const Vendor =require("../models/Vendor");
const multer = require("multer");
const path =require("path")

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }   
});
const  upload = multer({storage :storage});

const addFirm = async(req,res)=>{
    try{
        const {firmName,area,category,offer}= req.body;

    const image =req.file?req.file.filename:undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if(!vendor){
        res.status(404).json({message:"vendor not found"})
    }
    if(vendor.firm.length>0){
        res.status(400).json({message :"add only one firm"});
    }

    const firm =new Firm({
        firmName,area ,category ,offer ,image ,vendor:vendor._id
    }); 
    const savedFirm = await firm.save();
    const firmId = savedFirm._id;
    vendor.firm.push(savedFirm);
    
    await vendor.save() 
        
        return res.status(200).json({message:"Add-firm successfully",firmId,firmName})
        }catch(error){
            console.error(error);
            return res.status(500).json({message:"Interval server error 1"})
        }
    }
const deleteFirmById = async(req,res)=>{
    try {
        const firmId = req.params.firmId;
         const deleteFirm = await Firm.findByIdAndDelete(firmId);

        if (!deleteFirm){
            res.status(404).json({error:"product not found"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error:'Internal server error'})
    }
}
module.exports={addFirm:[upload.single('image'),addFirm],deleteFirmById}
