const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true
  }
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model('Note', noteSchema);
