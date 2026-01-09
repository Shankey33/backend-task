import { useState, useContext } from 'react';
import { AppContext } from '../context/context_api';

const Auth = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [userType, setUserType] = useState('regular');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const context = useContext(AppContext);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);
		try {
			if (isLogin) {
				if (!context?.login) throw new Error('Login function not available');
				await context.login(email, password);
			} else {
				if (!context?.signup) throw new Error('Signup function not available');
				await context.signup(name, email, password, userType);
			}
			// Check if login/signup succeeded by checking context user or token
			if (context?.user) {
				// success — nothing else to do, context already set user and token
			} else if (localStorage.getItem('token')) {
				// fallback: token present
			} else {
				setError('Authentication failed');
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong');
		}
		setLoading(false);
	};

	const toggleMode = () => {
		setIsLogin(!isLogin);
		setError('');
		setEmail('');
		setPassword('');
		setName('');
		setUserType('regular');
	};

	return (
		<div className="min-h-screen bg-black flex items-center justify-center p-5">
			<div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-200">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-black mb-2">
                        Authenticate yourself
					</h1>
					<p className="text-gray-600 text-sm">
						{isLogin ? 'Sign in to continue' : 'Sign up to get started'}
					</p>
				</div>
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					{!isLogin && (
						<div className="flex flex-col gap-1.5">
							<label htmlFor="name" className="text-sm font-medium text-black">Full Name</label>
							<input
								type="text"
								id="name"
								value={name}
								onChange={e => setName(e.target.value)}
								placeholder="Enter your full name"
								required
								className="px-4 py-3.5 border-2 border-gray-300 rounded-xl text-base outline-none transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/10 placeholder:text-gray-400 bg-white text-black"
							/>
						</div>
					)}
					<div className="flex flex-col gap-1.5">
						<label htmlFor="email" className="text-sm font-medium text-black">Email Address</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={e => setEmail(e.target.value)}
							placeholder="Enter your email"
							required
							className="px-4 py-3.5 border-2 border-gray-300 rounded-xl text-base outline-none transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/10 placeholder:text-gray-400 bg-white text-black"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label htmlFor="password" className="text-sm font-medium text-black">Password</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={e => setPassword(e.target.value)}
							placeholder="Enter your password"
							required
							minLength={6}
							className="px-4 py-3.5 border-2 border-gray-300 rounded-xl text-base outline-none transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/10 placeholder:text-gray-400 bg-white text-black"
						/>
					</div>
					{!isLogin && (
						<div className="flex flex-col gap-1.5">
							<label className="text-sm font-medium text-black mb-1">Account Type</label>
							<div className="flex gap-4">
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="userType"
										value="regular"
										checked={userType === 'regular'}
										onChange={() => setUserType('regular')}
									/>
									Normal
								</label>
								<label className="flex items-center gap-2">
									<input
										type="radio"
										name="userType"
										value="admin"
										checked={userType === 'admin'}
										onChange={() => setUserType('admin')}
									/>
									Admin
								</label>
							</div>
						</div>
					)}
					{error && (
						<div className="bg-gray-100 border border-gray-400 text-black px-4 py-3 rounded-lg text-sm text-center">
							{error}
						</div>
					)}
					<button
						type="submit"
						disabled={loading}
						className="bg-black text-white py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 mt-2 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
					>
						{loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
					</button>
				</form>
				<div className="text-center mt-6 pt-6 border-t border-gray-200">
					<p className="text-gray-600 text-sm">
						{isLogin ? "Don't have an account?" : 'Already have an account?'}
						<button
							type="button"
							onClick={toggleMode}
							className="bg-transparent border-none text-black font-semibold cursor-pointer ml-1 text-sm transition-colors duration-200 hover:underline"
						>
							{isLogin ? 'Sign Up' : 'Sign In'}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Auth;
