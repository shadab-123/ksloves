const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: String,required: true },
  unit: {type:String },
  content:{type:String}
});

module.exports = mongoose.model('Class', ClassSchema);