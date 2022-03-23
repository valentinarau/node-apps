var express = require('express');
var cors = require('cors');
require('dotenv').config();
let bodyParser = require('body-parser');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' })
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const { Schema } = mongoose;


var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true }
  },
  {timestamps: false,
  versionKey: false}
);

const File = mongoose.model("File", fileSchema);

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  res.json({
    "name":req.file.originalname ,
    "type":req.file.mimetype,
    "size":req.file.size})
  
})
