import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ENV } from '../lib/env.js';

export const authenticate = async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader;
	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}
	try {
		const decoded = jwt.verify(token, ENV.JWT_SECRET);
		const user = await User.findById(decoded.id).select('-password');
		if (!user) {
			console.warn('Authentication failed: user not found for token prefix', token?.toString().slice(0,12));
			return res.status(401).json({ message: 'User not found' });
		}
		// Debug: log token prefix and user id (dev only)
		if (process.env.NODE_ENV !== 'production') {
			console.debug('Authenticated user', user._id.toString(), 'tokenPrefix', token?.toString().slice(0,12));
		}
		req.user = user;
		next();
	} catch (err) {
		console.warn('Invalid token during authentication, tokenPrefix:', token?.toString().slice(0,12));
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

export const authorize = (req, res, next) => {
	if (req.user?.userType === 'admin') {
		return next();
	}
	return res.status(403).json({ message: 'Access denied: Admins only' });
};
