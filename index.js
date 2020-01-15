const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const MongoClient = require('mongodb').MongoClient

dotenv.config()
const app = express()

//storage and limitations of the uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads')
    },
    filename: (req, file,cb)=>{
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif'){
    cb(null,true);
    }else {
    cb(null,false);
}
};

const upload = multer({
    storage: storage, 
    limits:{fileSize: 1024 *1024* 5},
    fileFilter: fileFilter
    
});
//end of storage and limitations of the uploaded files

var str = ''

// displaying on browser
app.route('/deals').get((req,res)=>{
    MongoClient.connect(url, {useUnifiedTopology: true}, (err,client)=>{
        var db = client.db(process.env.dealsdb)
        var cursor = db.collection(process.env.dealscollection).find()
        cursor.each((err,item)=>{
            if(item != null) {
                str = str+"<img src='./uploads/2020-01-15T09:45:19.510ZScreenshot%20from%202020-01-10%2017-06-34.png'></br><b>Product: </b>"+item.dealsTitle + " </br><p>Before: "+ item.before_price+ "</p>"+ "<p>After: "+item.after_price +"</p></br>"
            }  
            res.send(str)         
    }) 
    }) 
    })




//making the uploads folder staticly public
app.use('/uploads', express.static('uploads'))

// db details
let url = 'mongodb://localhost';
const client =  new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true })

function makeDB(){
    if(!client.isConnected()){
        client.connect()
    }return client.db(process.env.dealsdb)
}


// posting deals
app.post('/deals',upload.single('dealsImage'), (req,res)=>{
    var request = req.body;
    // console.log(req.file)

    const db = makeDB()
    const inserted = db.collection(process.env.dealscollection).deleteOne({merchantId: 'Avechi', dealsImage: 'uploads/2020-01-14T09:15:45.277ZScreenshot from 2020-01-10 17-07-56.png', dealsTitle: "Julla Hoodie", before_price: '2,500', after_price: '2,000'})
    console.log(inserted)
  //to see what is in the database 
    var cursor = db.collection(process.env.dealscollection).find()
    cursor.each((err,doc)=>{
        if(doc === null){
            console.log("The database is empty")
        } else{
        console.log(doc);
        }
    })
    res.send(request)
    // console.log(request)
})


//starting the server
const port = 3000
app.listen(port, ()=>{
       console.log("listening") 
})


//exiting the server
process.on('SIGINT', ()=> {console.log("Exited"); process.exit();})

//list your dependencies /
// create mock server /
//connect to postman /
//create db
//connect to db
//remember to app.get
//populate db with csv to json