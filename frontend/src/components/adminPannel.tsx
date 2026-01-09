

import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/context_api';


const AdminPanel = () => {
	const context = useContext(AppContext);
	const getAdminDashboard = context?.getAdminDashboard;
	const updateAdminDashboard = context?.updateAdminDashboard;
	const [adminData, setAdminData] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchAdminData = async () => {
			setLoading(true);
			setError('');
			try {
				if (getAdminDashboard) {
					const data = await getAdminDashboard();
					setAdminData(data);
				}
			} catch (err) {
				setError('Failed to fetch admin dashboard');
			}
			setLoading(false);
		};
		fetchAdminData();
	}, [getAdminDashboard]);

	const handleDeleteUser = async (userId: string) => {
		if (!updateAdminDashboard) return;
		await updateAdminDashboard({ userId });
		// Refresh admin data
		if (getAdminDashboard) {
			const data = await getAdminDashboard();
			setAdminData(data);
		}
	};

	const handleDeleteTask = async (taskId: string) => {
		if (!updateAdminDashboard) return;
		await updateAdminDashboard({ taskId });
		// Refresh admin data
		if (getAdminDashboard) {
			const data = await getAdminDashboard();
			setAdminData(data);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-8">
				<h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>
				{loading ? (
					<div className="text-center">Loading...</div>
				) : error ? (
					<div className="text-center text-red-500">{error}</div>
				) : (
					<>
						<div className="mb-8">
							<h2 className="text-2xl font-bold mb-4">Users & Notes</h2>
							<table className="min-w-full bg-white border border-gray-200 rounded-lg">
								<thead>
									<tr>
										<th className="py-2 px-4 border-b">Name</th>
										<th className="py-2 px-4 border-b">Email</th>
										<th className="py-2 px-4 border-b">Notes Count</th>
										<th className="py-2 px-4 border-b">Actions</th>
									</tr>
								</thead>
								<tbody>
									{adminData?.userNotes?.map((user: any) => (
										<tr key={user.userId} className="border-b">
											<td className="py-2 px-4">{user.name}</td>
											<td className="py-2 px-4">{user.email}</td>
											<td className="py-2 px-4">{user.notes.length}</td>
											<td className="py-2 px-4 flex gap-2">
												<button onClick={() => handleDeleteUser(user.userId)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700">Delete User</button>
												{user.notes.map((note: any) => (
													<button key={note._id} onClick={() => handleDeleteTask(note._id)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700 ml-2">Delete Note</button>
												))}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="text-center">
							<button className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition">Logout</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default AdminPanel;
