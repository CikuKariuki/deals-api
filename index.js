const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const MongoClient = require('mongodb').MongoClient

dotenv.config()
const app = express()

app.post('/deals', (req,res)=>{
    var request = req.body;

    res.send(request)
})


//starting the server
const port = 3000
app.listen(port, ()=>{
       console.log("listening") 
})


//exiting the server
process.on('SIGINT', ()=> {console.log("Exited"); process.exit();})

//list your dependencies /
// create mock server
//connect to postman
//create db
//connect to db
//remember to app.get
//populate db with csv to json