const  Vendor = require("../models/Vendor.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv =require("dotenv");

dotEnv.config();    
const secretKey = process.env.whatIsYourName;

const vendorRegister  = async(req,res)=>{
    const {username,email,password} = req.body;
    console.log(req.body)
    try{
        const vendorEmail = await Vendor.findOne({email});
        if (vendorEmail){
            return res.status(400).json("Email already taken");
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({
            username,
            email,
            password: hashedPassword
        });
        await newVendor.save();
        res.status(201).json({message:"Vendor succesfully Registered"});
        console.log("registred");
    }
    catch(error){ 
           res.status(500).json({error:"Internal server error"});
        console.error(error);

    }
}

const vendorLogin=async(req,res)=>{
    const {email,password}= req.body;
    try{

    const vendorEmail = await Vendor.findOne({email});
    if( !(vendorEmail) || !(await bcrypt.compare(password,vendorEmail.password))){
        return res.status(401).json({error:"Invalid password or email"})
    }
    const token =jwt.sign({vendorId : vendorEmail._id},secretKey,{expiresIn:"1d"});
    console.log(email,"this is token",token)
    const vendorId = vendorEmail._id;
    const vendorFirmId = await vendorEmail.firm[0]
    console.log(vendorFirmId)
    res.status(200).json({success:"Login successful",token,vendorFirmId,vendorId})
   }
   catch(error){
    res.status(500).json({error:"Internal server error"});
    console.error(error);
   }
}

const getAllVendors =async(req,res)=>{
    try {
        const vendors = await Vendor.find().populate('firm')
        res.json({vendors})
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error")
        
    }
}

const getVendorById = async(req,res)=>{
    const vendorId = req.params.id;
    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if (!vendor){
            return res.status(404).json({error:"vendor not  found"})
        }
        return res.status(200).json({vendor})
    } catch (error) {               
        console.error(error);
        res.status(500).json("Internal server error")
    }
}

module.exports ={vendorRegister,vendorLogin,getAllVendors,getVendorById};