const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config()

const User = require('./models/user');

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





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
