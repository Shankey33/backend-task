
import { useContext } from 'react';
import { AppContext } from '../context/context_api';
import TaskList from './TaskList';

const AdminPanel = () => {
	const context = useContext(AppContext);
	const user = context?.user;
	const tasks = context?.tasks || [];

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
				<h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<div className="bg-blue-100 rounded-lg p-6 text-center">
						<h2 className="text-xl font-semibold mb-2">Users</h2>
						<p className="text-2xl">{user ? 1 : 0}</p>
						<p className="text-gray-500 text-sm">Logged in Admin</p>
					</div>
					<div className="bg-green-100 rounded-lg p-6 text-center">
						<h2 className="text-xl font-semibold mb-2">Tasks</h2>
						<p className="text-2xl">{tasks.length}</p>
						<p className="text-gray-500 text-sm">Total Tasks</p>
					</div>
					<div className="bg-yellow-100 rounded-lg p-6 text-center">
						<h2 className="text-xl font-semibold mb-2">Status</h2>
						<p className="text-2xl">{tasks.filter(t => t.completed).length} / {tasks.length}</p>
						<p className="text-gray-500 text-sm">Completed</p>
					</div>
				</div>
				<div className="mb-8">
					<h2 className="text-2xl font-bold mb-4">Task Management</h2>
					<TaskList />
				</div>
				<div className="text-center">
					<button className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition">Logout</button>
				</div>
			</div>
		</div>
	);
};

export default AdminPanel;
