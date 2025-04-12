
const asyncHandler = require('express-async-handler');
const Reminder = require('../models/reminderModel');

// @desc    Get all reminders
// @route   GET /api/reminders
// @access  Private
const getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ user: req.user.id });
  res.status(200).json(reminders);
});

// @desc    Create a reminder
// @route   POST /api/reminders
// @access  Private
const createReminder = asyncHandler(async (req, res) => {
  const { title, description, date, time, type, frequency, relatedTask } = req.body;

  if (!title || !date || !time) {
    res.status(400);
    throw new Error('Please add title, date, and time');
  }

  const reminder = await Reminder.create({
    user: req.user.id,
    title,
    description,
    date,
    time,
    type,
    frequency,
    isCompleted: false,
    relatedTask,
  });

  res.status(201).json(reminder);
});

// @desc    Get a reminder
// @route   GET /api/reminders/:id
// @access  Private
const getReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    res.status(404);
    throw new Error('Reminder not found');
  }

  // Check if reminder belongs to user
  if (reminder.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.status(200).json(reminder);
});

// @desc    Update a reminder
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    res.status(404);
    throw new Error('Reminder not found');
  }

  // Check if reminder belongs to user
  if (reminder.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  const updatedReminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedReminder);
});

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    res.status(404);
    throw new Error('Reminder not found');
  }

  // Check if reminder belongs to user
  if (reminder.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  await reminder.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Get reminder analytics
// @route   GET /api/reminders/analytics
// @access  Private
const getReminderAnalytics = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ user: req.user.id });
  
  // Calculate analytics
  const total = reminders.length;
  const completed = reminders.filter(reminder => reminder.isCompleted).length;
  const upcoming = reminders.filter(reminder => !reminder.isCompleted && new Date(reminder.date) > new Date()).length;
  const overdue = reminders.filter(reminder => !reminder.isCompleted && new Date(reminder.date) < new Date()).length;
  
  // Group reminders by type
  const byType = {};
  reminders.forEach(reminder => {
    const type = reminder.type || 'one-time';
    byType[type] = (byType[type] || 0) + 1;
  });
  
  const analytics = {
    total,
    completed,
    upcoming,
    overdue,
    completionRate: total ? (completed / total) * 100 : 0,
    byType,
  };
  
  res.status(200).json(analytics);
});

module.exports = {
  getReminders,
  createReminder,
  getReminder,
  updateReminder,
  deleteReminder,
  getReminderAnalytics,
};
