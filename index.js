const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config()

const User = require('./models/User');

// Mongo Atlas Connection
mongoose.connect(process.env.CONN_STRING, {dbName:'exercisetracker'})
  .then(() => console.log('Mongodb Connection Success!'))
  .catch((e) => console.error('Mongodb Connection Failed!', error))



app.use(cors())
app.use(express.static('public'))
app.get('/', async(req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});








const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
