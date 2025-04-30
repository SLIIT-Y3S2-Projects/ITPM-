import mongoose from 'mongoose';

const AnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalTasks: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  completionRate: { type: Number, default: 0 },
  tasksByCategory: { type: Map, of: Number },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Analytics', AnalyticsSchema);
