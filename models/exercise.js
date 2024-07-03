const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    description:String,
    duration:Number,
    date:Date
})

module.exports = mongoose.model('Exercise', exerciseSchema)