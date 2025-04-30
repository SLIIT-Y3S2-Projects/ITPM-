// Import Mongoose to define the schema
const mongoose = require('mongoose');

// Define the schema for the Reminder collection
const reminderSchema = mongoose.Schema(
  {
    // Reference to the User who created the reminder
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to User model
    },

    // Title of the reminder (required)
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },

    // Optional description for additional details
    description: {
      type: String,
    },

    // Date when the reminder should occur (required)
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },

    // Time when the reminder should trigger (required)
    time: {
      type: String,
      required: [true, 'Please add a time'],
    },

    // Type of reminder - can be one-time or recurring
    type: {
      type: String,
      enum: ['one-time', 'recurring'],
      default: 'one-time',
    },

    // Frequency for recurring reminders (if applicable)
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', ''],
      default: '',
    },

    // Flag to indicate if the reminder has been completed
    isCompleted: {
      type: Boolean,
      default: false,
    },

    // Optional reference to a related Task
    relatedTask: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task', // Reference to Task model
    },
  },
  {
    // Automatically include createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Export the Reminder model to be used in other parts of the app
module.exports = mongoose.model('Reminder', reminderSchema);
