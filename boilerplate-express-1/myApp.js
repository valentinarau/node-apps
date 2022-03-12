
var bodyParser = require('body-parser');
var express = require('express');
var app = express();



app.use(function(req, res, next) {
  console.log([req.method,req.path,"-",req.ip].join(" "));
  next();
})
app.use(bodyParser.urlencoded({extended: false}));



absolutePath = __dirname +"/views/index.html";
absolutePath2 = __dirname + "/public";
console.log("Hello World");
app.get("/",function(req,res){
  res.sendFile(absolutePath);
});

app.get("/now",function(req,res,next){
  req.time = new Date().toString();
  next();
},function(req,res){
  res.send({time:req.time});
}
       )

app.get("/:word/echo",function(req,res){
  res.send({"echo":req.params.word})
})


app.get("/json", (req, res) => {
  if(process.env.MESSAGE_STYLE == 'uppercase')
    res.json({
    message: "HELLO JSON"
  });
  else
  res.json({
    message: "Hello json"
  });
});

app.get("/name", function(req, res) {
  var firstName = req.query.first;
  var lastName = req.query.last;
  
  res.json({
    name: `${firstName} ${lastName}`
  });
});

app.post("/name",bodyParser.urlencoded({extended: false}), function(req, res) {
  var firstName = req.body.first;
  var lastName = req.body.last;
  
  res.json({
    name: `${firstName} ${lastName}`
  });
});

app.use("/public", express.static(absolutePath2));






































 module.exports = app;
