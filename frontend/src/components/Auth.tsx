import { useState, useContext } from 'react';
import { AppContext } from '../context/context_api';

function Auth() {
    // Form state - tracks whether user is logging in or signing up
    const [isLogin, setIsLogin] = useState(true);
    
    // Input field values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    
    // UI state
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Get the app context to store user data
    const context = useContext(AppContext);

    // Handle form submission
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault(); // Prevent page refresh
        setError(''); // Clear any previous errors
        setLoading(true); // Show loading state

        // Choose the right API endpoint
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        
        // Prepare the data to send
        const body = isLogin 
            ? { email, password } 
            : { email, password, name };

        try {
            // Send request to server
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            // Check if request was successful
            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            // Save user to context
            if (context) {
                context.setUser(data.user);
            }

            // Save token to browser storage
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

        } catch (err) {
            // Show error message
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong');
            }
        }

        setLoading(false); // Hide loading state
    }

    // Switch between login and signup forms
    function toggleMode() {
        setIsLogin(!isLogin);
        setError('');
        setEmail('');
        setPassword('');
        setName('');
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-5">
            <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-200">
                
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-black mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h1>
                    <p className="text-gray-600 text-sm">
                        {isLogin ? 'Sign in to continue' : 'Sign up to get started'}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    
                    {/* Name field - only shown for signup */}
                    {!isLogin && (
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="name" className="text-sm font-medium text-black">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                                required
                                className="px-4 py-3.5 border-2 border-gray-300 rounded-xl text-base outline-none transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/10 placeholder:text-gray-400 bg-white text-black"
                            />
                        </div>
                    )}

                    {/* Email field */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-medium text-black">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            className="px-4 py-3.5 border-2 border-gray-300 rounded-xl text-base outline-none transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/10 placeholder:text-gray-400 bg-white text-black"
                        />
                    </div>

                    {/* Password field */}
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-medium text-black">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            minLength={6}
                            className="px-4 py-3.5 border-2 border-gray-300 rounded-xl text-base outline-none transition-all duration-200 focus:border-black focus:ring-2 focus:ring-black/10 placeholder:text-gray-400 bg-white text-black"
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="bg-gray-100 border border-gray-400 text-black px-4 py-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 mt-2 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                {/* Footer - toggle between login/signup */}
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
}

export default Auth;
