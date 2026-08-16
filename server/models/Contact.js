const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Please provide a message']
    },
    status: {
      type: String,
      enum: ['Pending', 'Resolved'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
