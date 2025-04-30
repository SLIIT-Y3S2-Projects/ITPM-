const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });
  res.status(200).json(tasks);
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    dueDate,
    priority,
    status,
    category,
    tags,
    notes,
  } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Please add a title");
  }

  const task = await Task.create({
    user: req.user.id,
    title,
    description,
    dueDate,
    priority,
    status,
    category,
    tags,
    notes,
  });

  res.status(201).json(task);
});

// @desc    Get a task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check if task belongs to user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  res.status(200).json(task);
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check if task belongs to user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedTask);
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check if task belongs to user
  if (task.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await task.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Get task analytics
// @route   GET /api/tasks/analytics
// @access  Private
const getTaskAnalytics = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });

  // Calculate analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  // Group tasks by category
  const tasksByCategory = {};
  tasks.forEach((task) => {
    const category = task.category || "uncategorized";
    tasksByCategory[category] = (tasksByCategory[category] || 0) + 1;
  });

  // Group tasks by priority
  const tasksByPriority = {
    low: tasks.filter((task) => task.priority === "low").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    high: tasks.filter((task) => task.priority === "high").length,
  };

  const analytics = {
    totalTasks,
    completedTasks,
    pendingTasks,
    inProgressTasks,
    completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
    tasksByCategory,
    tasksByPriority,
  };

  res.status(200).json(analytics);
});

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  getTaskAnalytics,
};
