require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const { Schema } = mongoose;


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.use(bodyParser.urlencoded({extended: false}));


const urlSchema = new Schema({
  "original_url": String,
  "short_url": Number
})

const Url = mongoose.model('Url', urlSchema);

const createAndSaveUrl = (url,short,done) => {
  console.log("saving");
  newUrl = new Url({
  "original_url": url,
  "short_url": short
  });
  newUrl.save((error,data)=>{
    if(error) return console.log(error);
    else done(null,data);
  })
};

const findAndUpdate = (url,short,done) => {
  console.log("updating");
  let updated = Url.findOneAn
    "short_url":short}, {
    new: true
    },(error,updated)=>{
        if(error) return done(error);
        else done(null,udUpdate({
    "original_url":url}, {pdated);
  });
};


const findByUrl = (url,done) =>{
  console.log("finding");
  Url.find({"original_url":url},(error,data)=>{
    if(error) return console.log(error);
    else done(null,data);
  })
}

app.post("/api/shorturl",bodyParser.urlencoded({extended: false}),(req,res,done)=>{
    let url = req.body.url;
  let urlRegex = 
    new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)
  
  if(!url.match(urlRegex)){
    res.json({error: 'invalid url'})
    return
  }
    let short = 1;
    Url.findOne({}).sort({"short_url":"desc"}).exec((error,result)=>{
      console.log(result);
      if(!error ){
        if( result != undefined){
          short = result["short_url"] + 1;
        }
  
        createAndSaveUrl(url,short,done);
        
        res.json({"original_url":url,"short_url":short})
      }
      
    })
  })

app.get("/api/shorturl/:shorturl",(req,res)=>{
  let input = req.params.shorturl
  
  
  Url.findOne({"short_url": input}, (error, result) => {
    if(!error && result != undefined){
      res.redirect(result["original_url"])
    }else{
      console.log(result)
      res.json('URL not Found')
    }
  })
})