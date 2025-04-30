
const express = require('express');
const router = express.Router();
const {
  getReminders,
  createReminder,
  getReminder,
  updateReminder,
  deleteReminder,
  getReminderAnalytics,
} = require('../controllers/reminderController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getReminders)//get
  .post(protect, createReminder);// post

router.route('/analytics')
  .get(protect, getReminderAnalytics);

router.route('/:id')
  .get(protect, getReminder)
  .put(protect, updateReminder)
  .delete(protect, deleteReminder);

module.exports = router;
