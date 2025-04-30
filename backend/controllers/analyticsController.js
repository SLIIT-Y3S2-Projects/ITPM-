import Analytics from '../models/AnalyticsModel.js';

// Get analytics data for a user
export const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.params.userId;
    const data = await Analytics.findOne({ userId });

    if (!data) return res.status(404).json({ message: 'Analytics not found' });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create or update analytics
export const upsertAnalytics = async (req, res) => {
  try {
    const { userId, totalTasks, completedTasks, tasksByCategory } = req.body;

    const completionRate = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

    const updated = await Analytics.findOneAndUpdate(
      { userId },
      { totalTasks, completedTasks, completionRate, tasksByCategory },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
