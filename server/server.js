require('dotenv').config()
const express = require('express');
const server = express();
const PORT = 8000;
const mongoose = require("mongoose")
const helmet = require("helmet")
const bodyParser = require('body-parser')
const cors = require('cors')

const router = require("./router/router.js")

server.use(bodyParser.urlencoded({ extended: true}));
//to support url encoded bodies
server.use(bodyParser.json());

server.use("/public",express.static("./public"))

mongoose.connect("mongodb+srv://admin:1881a1938@cluster0.qb0bo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
mongoose.connection.once('open', ()=>{
    console.log('DB connection successfully');
})

server.use(helmet())

const corsOptions ={
    origin: ['http://localhost:8080',"http://localhost:8000"],
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
server.use(cors(corsOptions));

server.use("/api",router)

//Connect to PORT
server.listen(PORT, function(){
    console.log("Server running on "+PORT)
});