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
  },
  images: [
    {
      type: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
