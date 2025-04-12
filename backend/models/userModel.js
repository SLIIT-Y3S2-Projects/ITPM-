const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system',
      },
      notificationSettings: {
        email: {
          type: Boolean,
          default: true,
        },
        push: {
          type: Boolean,
          default: true,
        },
        silent: {
          type: Boolean,
          default: false,
        },
        silentHoursStart: {
          type: Number,
          min: 0,
          max: 23,
          required: false,
        },
        silentHoursEnd: {
          type: Number,
          min: 0,
          max: 23,
          required: false,
        },
      },
      defaultTaskView: {
        type: String,
        enum: ['list', 'calendar', 'kanban'],
        default: 'list',
      },
      defaultTaskSort: {
        type: String,
        enum: ['dueDate', 'priority', 'createdAt'],
        default: 'createdAt',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);