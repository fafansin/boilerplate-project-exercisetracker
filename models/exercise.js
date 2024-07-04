const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    person:{ type: Schema.Types.ObjectId, ref:'User'},
    description:String,
    duration:Number,
    date:Date
})

module.exports = mongoose.model('Exercise', exerciseSchema)