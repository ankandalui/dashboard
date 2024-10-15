const mongoose = require('mongoose');
const { Schema } = mongoose;

const TaskSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin', 
    required: true
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'staff',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  dueDate: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date
  },
  isAutoAssigned: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update the 'updated_at' field
TaskSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const Task = mongoose.model('task', TaskSchema);
module.exports = Task;