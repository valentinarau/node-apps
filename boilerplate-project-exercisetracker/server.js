const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
let bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const { Schema } = mongoose;

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

app.use(bodyParser.urlencoded({extended: false}));

//Schemas

const exerciseSchema = new mongoose.Schema(
  {
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    date: { type: String, required: true }
  },
  {
    timestamps: false,
    _id: false
  }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3
    },
    log: { type: [exerciseSchema], required: false }
  },
  {
    timestamps: false,
    versionKey: false
  }
);

const User = mongoose.model("User", userSchema);

app.get("/api/users", (req, res) => {
  return User.find().then(users => res.json(users));
});

app.post("/api/users", (req, res) => {
  const { username } = req.body;

  User.findOne({ username }).then(user => {
    if (user) return res.json(user);
    else {
      const newUser = new User({ username });

      newUser.save().then(() => res.json(newUser));
    }
  });
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  let { description, duration, date } = req.body;
  const id = req.params._id;

  duration = parseInt(duration);

  if (!date) {
    date = new Date();
  }
  date = new Date(date);
  date = date.toDateString();

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    let updated = await User.findByIdAndUpdate(
      id ,
      {
        $push: {
          log: {
            date,
            duration,
            description
          }
        }
      }
    ).exec();

    let user = await User.findById(id).exec();

    return res.json({
      _id: user._id,
      username: user.username,
      date: date,
      duration: duration,
      description: description
    });
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const id = req.params._id;
  
  const user = await User.findById(id).exec();
  let {_id, username, log} = user;
  const count = log.length;
  
  let {from, to, limit} = req.query;
  
  if (from) {
    from = new Date(from);
    log = log.filter((exercise) => new Date(exercise.date) >= from);
  }
  
  if (to) {
    to = new Date(to);
    log = log.filter((exercise) => new Date(exercise.date) <= to);
  }
  
  if (limit) {
    log = log.slice(0, limit);
  }
  
  return res.json({
    _id,
    username,
    log,
    count
  });
});


app.get("/api/users/:_id/exercises", (req, res) => {
  return User.findById(req.params.id).then(user => res.json(user));
});

