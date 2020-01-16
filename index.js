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

    
//getting deals
app.get('/gotdeals', async (req,res)=>{
    let arr = []
    const db = makeDB()
    var cursor = db.collection(process.env.dealscollection).find()
    const result = await cursor.toArray()
    console.log(result)
    res.json(result);
      

})
//end of getting deals


// posting deals
app.post('/deals',upload.single('dealsImage'), (req,res)=>{  
    var request = req.body;
    // console.log(req.body)

    const db = makeDB()
    const inserted = db.collection(process.env.dealscollection)//.insertOne({merchantId: 'VC', dealsDescription: 'Scotch bar stool', before_price: '12,999', after_price: '8,999', storeUrl: 'https://victoriacourts.co.ke/shop-2/outdoor/bar-stool/scotch-bar-stool/', imageUrl: 'https://victoriacourts.co.ke/wp-content/uploads/2018/11/D01BS125-A.jpg'})
    // console.log( "New insertion: "+ inserted)
  //to see what is in the database  
    var cursor = db.collection(process.env.dealscollection).find()
    cursor.each((err,doc)=>{
        console.log(doc); 
        
    })
    res.send(request)
    // console.log(request) 
})


//starting the server
const port = 3001
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