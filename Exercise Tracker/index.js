const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
})

let User = mongoose.model('user', userSchema);

const exerciseSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: Date
})

let Exercise = mongoose.model('exercise', exerciseSchema);

app.post("/api/users", async (req, res) => {
  // console.log(req.body)
  let user = req.body.username;

  try {
    const foundUser = await User.findOne({ username: user });

    if (!foundUser) {
      const userObj = new User({ username: user });
      const newUser = await userObj.save();
      res.json(newUser);
    }
    else {
      res.json(foundUser);
    }
  } catch (err) {
    console.log(err);
  }
})

app.get("/api/users", async (req, res) => {
  const allUsers = await User.find({});
  res.json(allUsers);
})
app.post("/api/users/:_id/exercises", async (req, res) => {
  const id = req.params._id;

  const { description, duration, date } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.json("User not found. Incorrect Id");
    }
    else {
      const exerciseObj = new Exercise({
        userid: id,
        description,
        duration,
        date: date ? new Date(date) : new Date()
      })

      const exercise = await exerciseObj.save();

      res.json({
        _id: user._id,
        username: user.username,
        description: exercise.description,
        duration: exercise.duration,
        date: new Date(exercise.date).toDateString()
      })
    }
  } catch (err) {
    console.log(err);
  }
})

app.get("/api/users/:_id/logs", async (req, res) => {
  const id = req.params._id;
  const {from, to, limit} = req.query;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.send("User not found. Invalid Id");
      return;
    }
    else{  
      let dateObj = {}
      if(from){
        dateObj["$gte"] = new Date(from);
      }
      if(to){
        dateObj["$lte"] = new Date(to);
      }
      let filter = {userid: id};
      if(from || to){
        filter.date = dateObj;
      }
      
      const exercises = await Exercise.find(filter).limit(lim = limit ? limit : 500);
      const count = exercises.length;

      const log = exercises.map(ex => ({
        description: ex.description,
        duration: ex.duration,
        date: new Date(ex.date).toDateString()
      }))
   const resObj = {
 
         _id: user.id,
       username: user.username,
        count,
        log
      }
      res.json(resObj);
    }
  } catch (err) {
    console.log(err);
  }
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
