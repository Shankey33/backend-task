import User from '../models/User.js';
import Task from '../models/Task.js';

export const getAdminDashboard = async (req, res) => {
	try {
		const users = await User.find().populate('tasks');
		const totalUsers = users.length;

		const userNotes = users.map(user => ({
			userId: user._id,
			name: user.name,
			email: user.email,
			notes: user.tasks
		}));
		res.json({
			totalUsers,
			userNotes
		});
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
};

export const updateAdminDashboard = async (req, res) => {
	try {
		const { userId, taskId } = req.body;
		if (userId) {
			const user = await User.findByIdAndDelete(userId);
			if (user) {
				// Optionally, delete all tasks belonging to this user
				await Task.deleteMany({ _id: { $in: user.tasks } });
				return res.json({ message: 'User and their tasks deleted' });
			} else {
				return res.status(404).json({ message: 'User not found' });
			}
		}
		if (taskId) {
			// Delete task and remove from any user's tasks array
			const task = await Task.findByIdAndDelete(taskId);
			if (task) {
				await User.updateMany(
					{ tasks: taskId },
					{ $pull: { tasks: taskId } }
				);
				return res.json({ message: 'Task deleted' });
			} else {
				return res.status(404).json({ message: 'Task not found' });
			}
		}
		res.status(400).json({ message: 'No userId or taskId provided' });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
};
