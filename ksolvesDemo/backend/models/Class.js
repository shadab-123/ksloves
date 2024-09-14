const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: String,required: true },
  unit: {type:String },
  content:{type:String},
  comments: [String] // Array to store comments
});

module.exports = mongoose.model('Class', ClassSchema);