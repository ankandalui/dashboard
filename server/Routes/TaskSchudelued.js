const express = require('express');
const Task = require('../models/TaskModel');
const Staff = require('../models/StaffSchema');
const { validationResult } = require('express-validator');
const { OpenAI } = require('openai');
const FetchUser = require('../middleware/FetchUser');
const { body } = require('express-validator');

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const TaskController = {
  // Manually assign a task to a staff member
  assignTasks: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const userId = req.user.id;
      const { staffId, tasks } = req.body;

      const staff = await Staff.findById(staffId);
      if (!staff) {
        return res.status(404).json({ success: false, error: 'Staff member not found' });
      }

      const createdTasks = [];

      for (const task of tasks) {
        const { title, description, priority } = task;
        const newTask = new Task({
          userId,
          staffId,
          title,
          description,
          priority,
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          isAutoAssigned: false
        });

        const validationError = newTask.validateSync();
        if (validationError) {
          return res.status(400).json({ success: false, error: 'Validation error', details: validationError.errors });
        }

        await newTask.save();
        createdTasks.push(newTask);
      }

      // Assign the first task to the staff member
      if (createdTasks.length > 0) {
        staff.isAvailable = false;
        staff.currentTaskId = createdTasks[0]._id;
        await staff.save();
      }

      res.status(201).json({ success: true, tasks: createdTasks });
    } catch (error) {
      console.error('Error in assignTasks:', error);
      res.status(500).json({ success: false, error: 'Server error', details: error.message });
    }
  },

  // Automatically assign tasks to staff members
  autoAssignTasks: async () => {
    try {
      // Get all available staff members
      const availableStaff = await Staff.find({ isAvailable: true });
      
      // Get unassigned tasks
      const unassignedTasks = await Task.find({ staffId: null });

      // Use AI to match tasks with available staff members
      for (const task of unassignedTasks) {
        if (availableStaff.length === 0) break; // No available staff

        const bestStaff = await findBestStaffForTask(task, availableStaff);
        if (bestStaff) {
          task.staffId = bestStaff._id;
          task.isAutoAssigned = true;
          await task.save();

          // Update staff availability
          bestStaff.isAvailable = false;
          bestStaff.currentTaskId = task._id;
          await bestStaff.save();

          // Remove assigned staff from available list
          availableStaff.splice(availableStaff.indexOf(bestStaff), 1);
        }
      }

      console.log('Tasks auto-assigned successfully');
    } catch (error) {
      console.error('Error in auto-assigning tasks:', error);
    }
  },

  // Get all tasks for a specific staff member
  getStaffTasks: async (req, res) => {
    try {
      const tasks = await Task.find({ staffId: req.params.staffId });
      res.status(200).json({ success: true, tasks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  },

  // Update task status
  updateTaskStatus: async (req, res) => {
    try {
      const { taskId, status } = req.body;
      const task = await Task.findById(taskId);

      if (!task) {
        return res.status(404).json({ success: false, error: 'Task not found' });
      }

      task.status = status;
      if (status === 'completed') {
        task.completedAt = new Date();
        
        const staff = await Staff.findById(task.staffId);
        if (staff) {
          // Find the next pending task for this staff member
          const nextTask = await Task.findOne({ 
            staffId: staff._id, 
            status: 'pending', 
            _id: { $ne: task._id } 
          }).sort('createdAt');
          
          if (nextTask) {
            staff.currentTaskId = nextTask._id;
            nextTask.status = 'in-progress';
            await nextTask.save();
          } else {
            staff.isAvailable = true;
            staff.currentTaskId = null;
            // Trigger auto-assignment for this staff member
            await assignNewTaskToStaff(staff);
          }
          
          await staff.save();
        }
      }

      await task.save();

      res.status(200).json({ success: true, task });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Server error' });
    }
  },
};
  
  // Check task status and reassign if overdue
  async function assignNewTaskToStaff(staff) {
    try {
      // Find an unassigned task
      const unassignedTask = await Task.findOne({ staffId: null, status: 'pending' });
  
      if (unassignedTask) {
        // Assign the task to the staff member
        unassignedTask.staffId = staff._id;
        unassignedTask.isAutoAssigned = true;
        unassignedTask.status = 'in-progress';
        await unassignedTask.save();
  
        // Update staff availability
        staff.isAvailable = false;
        staff.currentTaskId = unassignedTask._id;
        await staff.save();
  
        console.log(`New task ${unassignedTask._id} assigned to staff ${staff._id}`);
      } else {
        console.log(`No unassigned tasks available for staff ${staff._id}`);
      }
    } catch (error) {
      console.error('Error in assigning new task to staff:', error);
    }
  }

// New function to assign a new task to a staff member
async function assignNewTaskToStaff(staff) {
  try {
    // Find an unassigned task
    const unassignedTask = await Task.findOne({ staffId: null });

    if (unassignedTask) {
      // Assign the task to the staff member
      unassignedTask.staffId = staff._id;
      unassignedTask.isAutoAssigned = true;
      await unassignedTask.save();

      // Update staff availability
      staff.isAvailable = false;
      staff.currentTaskId = unassignedTask._id;
      await staff.save();

      console.log(`New task ${unassignedTask._id} assigned to staff ${staff._id}`);
    } else {
      console.log(`No unassigned tasks available for staff ${staff._id}`);
    }
  } catch (error) {
    console.error('Error in assigning new task to staff:', error);
  }
}

// AI function to find the best staff for a task
async function findBestStaffForTask(task, availableStaff) {
  try {
    // Prepare the prompt for the AI
    const prompt = `Given the following task: "${task.title}" with description "${task.description}" and priority "${task.priority}", and a list of available staff members with their skills and departments, who would be the best person to assign this task to? Available staff members: ${JSON.stringify(availableStaff.map(s => ({ name: s.name, department: s.department })))}`;

    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 100
    });

    const aiSuggestion = completion.choices[0].text.trim();
    
    // Parse the AI suggestion and find the corresponding staff member
    const suggestedStaff = availableStaff.find(s => aiSuggestion.toLowerCase().includes(s.name.toLowerCase()));
    
    return suggestedStaff || availableStaff[0]; // Default to first available staff member if no match found
  } catch (error) {
    console.error('Error in AI task assignment:', error);
    return availableStaff[0]; // Default to first available staff member in case of error
  }
}

// Routes
router.post('/assign', FetchUser, [
  body('staffId').notEmpty().withMessage('Staff ID is required'),
  body('tasks').isArray().withMessage('Tasks must be an array'),
  body('tasks.*.title').notEmpty().withMessage('Title is required for each task'),
  body('tasks.*.description').notEmpty().withMessage('Description is required for each task'),
  body('tasks.*.priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high for each task'),
], TaskController.assignTasks);

router.get('/staff/:staffId', FetchUser, TaskController.getStaffTasks);

router.get('/staff-details', FetchUser, async (req, res) => {
  try {
    const staffMembers = await Staff.find().populate('currentTaskId');
    res.status(200).json({ success: true, staffMembers });
  } catch (error) {
    console.error('Error fetching staff details:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
router.put('/update-status', FetchUser, [
  body('taskId').notEmpty().withMessage('Task ID is required'),
  body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
], TaskController.updateTaskStatus);

router.post('/auto-assign', FetchUser, async (req, res) => {
  await TaskController.autoAssignTasks();
  res.status(200).json({ success: true, message: 'Auto-assignment triggered' });
});

router.get('/all-tasks', FetchUser, async (req, res) => {
  try {
    const tasks = await Task.find().populate('staffId', 'name');
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/check-status', FetchUser, async (req, res) => {
  await TaskController.checkTaskStatus();
  res.status(200).json({ success: true, message: 'Task status check triggered' });
});

module.exports = { TaskController, router };