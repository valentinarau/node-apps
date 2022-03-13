// first, I require express module
let express = require('express');
let bodyParser = require('body-parser');

// to use the environment variables created
// VARIABLE_NAME=value
require('dotenv').config()

// to access those variables
console.log(process.env.WAIFU_GREETING)

// then I create my app by running express method
let app = express();

// when i want the app to be running on a port
app.listen(3000);

// use the url encoded middleware to parse body in post requests
app.use(bodyParser.urlencoded({extended: false}));

// serve static assets (images, stylesheets) located somewhere else
// in our html, it will look for the path pics but it won't find it
// instead of a server, in this case we have the images folder
// what it will do: whenever is requested the pics folder it will replace it for images 
// it has to intercept a route and do something else instead
// in this case we use middleware
// METHOD vs use: when we use method is for running the code for that method, whereas use is for every request
// to mount it: app.use(PATH,MIDDLEWARE_FUNC)
// or app.use(MIDDLEWARE_FUNC), in this case it will do for any path (and any request bc of use)
// where the function is express.static(ABS_PATH) that replaces the path for you
app.use('/pics',express.static(__dirname + '/images'));


// Implement Root-Level Request Logger Middleware
// next will take the next function in the stack, sending hello darling  
app.get('/hello', (req,res,next)=>{
console.log(req.method);
console.log(req.ip);
next();
})


// create a basic route app.METHOD(PATH, HANDLER)
// in this case, we'll return the string 'Hello World'
app.get('/hello',(req,res)=>{
    res.send('Hello Darling');
})

// send a file. For example, an html file
// we have to put an absolute path with __dirname
// __dirname points to the current directory
app.get('/',(req,res)=>{
    res.sendFile(__dirname + '/index.html');
})



// serve JSON on an specific route
// its better than returning an entire html, because just the machine will be reading the information
// the best way to send data nowadays is JSON
let waifu = {
    'name': 'Zero Two',
    'top': 2
};

// chain middleware
// put as many functions as you want

app.get('/waifus',(req,res,next)=>{
    console.log("uwu");
    next();
},(req,res)=>{
    res.json(waifu);
})

// get route parameter input from client
// /:PARAMETER, the ":" means its a parameter

// get query parameter input from client
// /PARAMETER?VALUENAME=VALUE&PARAMETER2...

let waifus = {
    'zero two': {name: 'zero two', top: 2},
    'komi': {name: 'shoko',top: 1},
    'asuka': {name: 'asuka', top: 3}
}


app.get('/waifu',(req,res)=>{
    console.log(req.query)
    let name = req.query.name;
    if(waifus[name]){
        res.json(waifus[name]);
    }
    else{
        res.json({'Not Found':404});
    }
})


app.get('/waifu/:name',(req,res)=>{
    let name = req.params.name;
    if(waifus[name]){
        res.json(waifus[name]);
    }
    else{
        res.json({'Not Found':404});
    }
})

app.get("/:word/echo",function(req,res){
    res.send({"echo":req.params.word})
  })

  // use body parser to parse POST requests
  // First function: middleware function to encode data post
  // Second function: what we will be doing 
  app.post('/search',bodyParser.urlencoded({extended: false}),(req,res)=>{
    let name = req.body.name;
    if(waifus[name]){
        res.json(waifus[name]);
    }
    else{
        res.json({'Not Found':404});
    }
  })


