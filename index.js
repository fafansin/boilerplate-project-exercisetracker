const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

const User = require('./models/user');
const Exercise = require('./models/exercise');

// Mongo Atlas Connection
mongoose.connect(process.env.CONN_STRING, {dbName:'exercisetracker'})
  .then(() => console.log('Mongodb Connection Success!'))
  .catch((e) => console.error('Mongodb Connection Failed!', e))



app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))
app.get('/', async(req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
  const {username} = req.body;
  const ref = await User.create({username:username});
  res.json({username:ref.username, _id:ref.id})
})

app.get('/api/users', async (req, res) => {
  const ref = await User.find({}, 'username');
  res.json(ref);
})

app.post('/api/users/:id/exercises', async (req, res)=> {
  const { description, duration, date} = req.body;
  const { id } = req.params;
  
  const user = await User.findById(id);
  if(!user){
    return res.json({error:"User nor found"});
  }
  // Form exercise obj
  const exercise = await Exercise.create({
    description:description,
    duration:parseInt(duration),
    date:date ? new Date(date) : new Date(),
    person:user._id
  })
  
  
  res.json({
    username:user.username, 
    description:exercise.description,
    duration:exercise.duration,
    date:exercise.date.toDateString(),
    _id:user._id
  })
})

app.get('/api/users/:id/logs', async (req, res) => {
  const { from, to, limit } = req.query;
  const {id} = req.params;
  const ref = await User.find({});
  
  res.send({data:ref})
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
