// const express = require('express');
// const Task = require('../models/TaskModel');
// const Staff = require('../models/StaffSchema');
// const { validationResult } = require('express-validator');
// const { OpenAI } = require('openai');
// const FetchUser = require('../middleware/FetchUser');
// const { body } = require('express-validator');
// const cron = require('node-cron');

// const router = express.Router();

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// const TaskController = {
//   // Manually assign tasks (bulk creation)
//   assignTasks: async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//       const userId = req.user.id;
//       const { staffId, tasks } = req.body;

//       const staff = await Staff.findById(staffId);
//       if (!staff) {
//         return res.status(404).json({ success: false, error: 'Staff member not found' });
//       }

//       const createdTasks = [];

//       for (const task of tasks) {
//         const { title, description, priority } = task;
//         const newTask = new Task({
//           userId,
//           staffId,
//           title,
//           description,
//           priority,
//           dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
//           isAutoAssigned: false
//         });

//         const validationError = newTask.validateSync();
//         if (validationError) {
//           return res.status(400).json({ success: false, error: 'Validation error', details: validationError.errors });
//         }

//         await newTask.save();
//         createdTasks.push(newTask);
//       }

//       // Assign the first task to the staff member
//       if (createdTasks.length > 0) {
//         staff.isAvailable = false;
//         staff.currentTaskId = createdTasks[0]._id;
//         await staff.save();
//       }

//       res.status(201).json({ success: true, tasks: createdTasks });
//     } catch (error) {
//       console.error('Error in assignTasks:', error);
//       res.status(500).json({ success: false, error: 'Server error', details: error.message });
//     }
//   },

//   // Auto-assign tasks (improved version)
//   autoAssignTasks: async () => {
//     try {
//       const availableStaff = await Staff.find({ isAvailable: true });
//       const unassignedTasks = await Task.find({ staffId: null });

//       for (const staff of availableStaff) {
//         if (unassignedTasks.length === 0) break;

//         const bestTask = await findBestTaskForStaff(staff, unassignedTasks);
//         if (bestTask) {
//           bestTask.staffId = staff._id;
//           bestTask.isAutoAssigned = true;
//           await bestTask.save();

//           staff.isAvailable = false;
//           staff.currentTaskId = bestTask._id;
//           await staff.save();

//           unassignedTasks.splice(unassignedTasks.indexOf(bestTask), 1);
//         }
//       }

//       console.log('Tasks auto-assigned successfully');
//     } catch (error) {
//       console.error('Error in auto-assigning tasks:', error);
//     }
//   },

//   // Check task status and reassign if overdue
//   checkTaskStatus: async () => {
//     try {
//       const overdueTasks = await Task.find({
//         status: { $ne: 'completed' },
//         dueDate: { $lt: new Date() }
//       });

//       for (const task of overdueTasks) {
//         if (task.staffId) {
//           const staff = await Staff.findById(task.staffId);
//           if (staff) {
//             staff.isAvailable = true;
//             staff.currentTaskId = null;
//             await staff.save();
//           }
//         }

//         task.staffId = null;
//         task.isAutoAssigned = false;
//         task.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//         await task.save();
//       }

//       await TaskController.autoAssignTasks();

//       console.log('Task status checked and overdue tasks reassigned');
//     } catch (error) {
//       console.error('Error in checking task status:', error);
//     }
//   },

//   // Update task status
//   updateTaskStatus: async (req, res) => {
//     try {
//       const { taskId, status } = req.body;
//       const task = await Task.findById(taskId);

//       if (!task) {
//         return res.status(404).json({ success: false, error: 'Task not found' });
//       }

//       task.status = status;
//       if (status === 'completed') {
//         task.completedAt = new Date();
        
//         const staff = await Staff.findById(task.staffId);
//         if (staff) {
//           // Find the next task for this staff member
//           const nextTask = await Task.findOne({ staffId: staff._id, status: { $ne: 'completed' } }).sort('createdAt');
          
//           if (nextTask) {
//             staff.currentTaskId = nextTask._id;
//           } else {
//             staff.isAvailable = true;
//             staff.currentTaskId = null;
//           }
          
//           await staff.save();
//         }
//       }

//       await task.save();

//       // If no more tasks for this staff, trigger auto-assignment
//       if (status === 'completed' && !await Task.findOne({ staffId: task.staffId, status: { $ne: 'completed' } })) {
//         await TaskController.autoAssignTasks();
//       }

//       res.status(200).json({ success: true, task });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, error: 'Server error' });
//     }
//   },

//   // Get all tasks for a specific staff member
//   getStaffTasks: async (req, res) => {
//     try {
//       const tasks = await Task.find({ staffId: req.params.staffId });
//       res.status(200).json({ success: true, tasks });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ success: false, error: 'Server error' });
//     }
//   },
// };

// // AI function to find the best task for a staff member
// async function findBestTaskForStaff(staff, unassignedTasks) {
//   try {
//     const prompt = `Given the following staff member: "${staff.name}" in the "${staff.department}" department, and a list of unassigned tasks, which task would be the best fit? Unassigned tasks: ${JSON.stringify(unassignedTasks.map(t => ({ title: t.title, description: t.description, priority: t.priority })))}`;

//     const completion = await openai.createCompletion({
//       model: "text-davinci-002",
//       prompt: prompt,
//       max_tokens: 100
//     });

//     const aiSuggestion = completion.choices[0].text.trim();
    
//     const suggestedTask = unassignedTasks.find(t => aiSuggestion.toLowerCase().includes(t.title.toLowerCase()));
    
//     return suggestedTask || unassignedTasks[0];
//   } catch (error) {
//     console.error('Error in AI task assignment:', error);
//     return unassignedTasks[0];
//   }
// }

// // Routes
// router.post('/assign', FetchUser, [
//   body('staffId').notEmpty().withMessage('Staff ID is required'),
//   body('tasks').isArray().withMessage('Tasks must be an array'),
//   body('tasks.*.title').notEmpty().withMessage('Title is required for each task'),
//   body('tasks.*.description').notEmpty().withMessage('Description is required for each task'),
//   body('tasks.*.priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be low, medium, or high for each task'),
// ], TaskController.assignTasks);

// router.get('/staff/:staffId', FetchUser, TaskController.getStaffTasks);

// router.put('/update-status', FetchUser, [
//   body('taskId').notEmpty().withMessage('Task ID is required'),
//   body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status'),
// ], TaskController.updateTaskStatus);

// router.post('/auto-assign', FetchUser, async (req, res) => {
//   await TaskController.autoAssignTasks();
//   res.status(200).json({ success: true, message: 'Auto-assignment triggered' });
// });

// router.get('/all-tasks', FetchUser, async (req, res) => {
//   try {
//     const tasks = await Task.find().populate('staffId', 'name');
//     res.status(200).json({ success: true, tasks });
//   } catch (error) {
//     console.error('Error fetching all tasks:', error);
//     res.status(500).json({ success: false, error: 'Server error' });
//   }
// });

// router.post('/check-status', FetchUser, async (req, res) => {
//   await TaskController.checkTaskStatus();
//   res.status(200).json({ success: true, message: 'Task status check triggered' });
// });

// // Set up cron jobs
// cron.schedule('*/10 * * * *', () => {
//   console.log('Checking task status');
//   TaskController.checkTaskStatus();
// });

// cron.schedule('0 0 * * *', () => {
//   console.log('Running daily auto task assignment');
//   TaskController.autoAssignTasks();
// });

// module.exports = { TaskController, router };