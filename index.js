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
    return res.json({error:"User not found"});
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
  
  try{
    const user = await User.findById(id);

    const filter = { person:id }

    if(from && to){
      filter.date = {$gte:new Date(from), $lte: new Date(to)}
    }else if(from){
      filter.date = {$gte: new Date(from)}
    }else if(to){
      filter.date = {$lte: new Date(to)}
    }


    const exercises = await Exercise.find(filter).limit(limit ? limit : 0);
    const logs = exercises.map(item => {
      return {description:item.description, duration:item.duration, date:item.date.toDateString()}
    })

    res.json({
      _id:id,
      username:user.username,
      count:logs.length,
      ...(from && {from:new Date(from).toDateString()}),
      ...(to && {to:new Date(to).toDateString()}),
      log:logs
    });
  }catch(e){
    console.error('ERROR', e.message);
    res.json({error:'Query error'})
  }
  
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
