
const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    time: {
      type: String,
      required: [true, 'Please add a time'],
    },
    type: {
      type: String,
      enum: ['one-time', 'recurring'],
      default: 'one-time',
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', ''],
      default: '',
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Reminder', reminderSchema);
//export 