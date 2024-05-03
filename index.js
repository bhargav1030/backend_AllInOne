const express = require("express");
const dotEnv =require("dotenv");
const mongoose =require("mongoose");
const vendorRoutes =require('./routes/vendorRoutes');
const bodyParser  =require("body-parser") ;
const firmRoutes =require('./routes/firmRoutes');
const productRoutes = require('./routes/ProductRoutes');
const cors = require('cors');
const path =require('path');



const app= express();
const port =process.env.PORT || 4000;
dotEnv.config();
app.use(cors());
mongoose.connect(process.env.Mongo_Url)
.then(()=>console.log("MongoDb connect successful"))
.catch((error=>console.log(error)))

app.use(bodyParser.json());
app.use('/vendor',vendorRoutes);
app.use('/firm',firmRoutes);
app.use('/product',productRoutes);
app.use('/uploads',express.static('uploads'));

app.listen(port,()=>{
    console.log("server stared runinng at 4000");
})

app.use("/",(req,res)=>{
    res.send("Welcome to All in my delivery");
})