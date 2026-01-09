import User from '../models/User.js';
import Task from '../models/Task.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ENV } from '../lib/env.js';

// Register a new user
export const registerUserController = async (req, res) => {
	try {
		const { name, email, password, userType } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ message: 'All fields are required' });
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({ message: 'User already exists' });
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashedPassword, userType });
		const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, { expiresIn: '7d' });
		res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, userType: user.userType }, token });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
};

// Login user
export const fetchUserController = async (req, res) => {
	try {
		const { email, password} = req.body;
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, { expiresIn: '7d' });
		res.json({ user: { id: user._id, name: user.name, email: user.email, userType: user.userType }, token });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
};

// Get all tasks for the authenticated user
export const fetchTasksController = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate('tasks');
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		res.json({ tasks: user.tasks });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
};

// Create a new task for the authenticated user
export const createTaskController = async (req, res) => {
	try {
		const { title, description } = req.body;
		if (!title) {
			return res.status(400).json({ message: 'Title is required' });
		}
		const task = await Task.create({ title, description});
		// Add task to user's tasks array
		await User.findByIdAndUpdate(req.user._id, { $push: { tasks: task._id } });
		res.status(201).json({ task });
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
};

// Update a task
export const updateTaskController = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;
		const task = await Task.findOneAndUpdate(id, updates);
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		res.sendStatus(204);
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
};

// Delete a task
export const deleteTaskController = async (req, res) => {
	try {
		const { id } = req.params;
		const task = await Task.findOneAndDelete(id);
		res.sendStatus(204);
	} catch (err) {
		res.status(500).json({ message: 'Server error', error: err.message });
	}
};
