// Import required modules
const express = require('express');
const router = express.Router();

// Import controller functions for reminder operations
const {
  getReminders,
  createReminder,
  getReminder,
  updateReminder,
  deleteReminder,
  getReminderAnalytics,
} = require('../controllers/reminderController');

// Import middleware to protect routes (requires authentication)
const { protect } = require('../middleware/authMiddleware');

// Route: GET /api/reminders
// Description: Get all reminders for the authenticated user
// Access: Private
// Route: POST /api/reminders
// Description: Create a new reminder for the authenticated user
// Access: Private
router.route('/')
  .get(protect, getReminders)  // Retrieve all reminders
  .post(protect, createReminder);  // Create a new reminder

// Route: GET /api/reminders/analytics
// Description: Get analytics data related to reminders (e.g., total reminders, stats)
// Access: Private
router.route('/analytics')
  .get(protect, getReminderAnalytics);

// Route: GET /api/reminders/:id
// Description: Get a specific reminder by ID
// Access: Private
// Route: PUT /api/reminders/:id
// Description: Update an existing reminder by ID
// Access: Private
// Route: DELETE /api/reminders/:id
// Description: Delete a reminder by ID
// Access: Private
 // Delete a reminder
 

// Export the router to be used in the main app
module.exports = router;

