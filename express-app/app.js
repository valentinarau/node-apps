// first, I require express module
let express = require('express');

// to use the environment variables created
// VARIABLE_NAME=value
require('dotenv').config()

// to access those variables
console.log(process.env.WAIFU_GREETING)

// then I create my app by running express method
let app = express();

// when i want the app to be running on a port
app.listen(3000);

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

// serve static assets (images, stylesheets) located somewhere else
// in our html, it will look for the path pics but it won't find it
// instead of a server, in this case we have the images folder
// what it will do: whenever is requested the pics folder it will replace it for images 
// it has to intercept a route and do something else instead
// in this case we use middleware
// to mount it: app.use(PATH,MIDDLEWARE_FUNC)
// or app.use(MIDDLEWARE_FUNC), in this case it will do for any request
// where the function is express.static(ABS_PATH) that replaces the path for you
app.use('/pics',express.static(__dirname + '/images'));

// serve JSON on an specific route
// its better than returning an entire html, because just the machine will be reading the information
// the best way to send data nowadays is JSON
let waifu = {
    'name': 'Zero Two',
    'code': 02
};

app.get('/waifu',(req,res)=>{
    res.json(waifu);
})