import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Activity } from 'lucide-react';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                email, password
            });
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            setUser(res.data);
            navigate(`/${res.data.role}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
            <div className="glass-card p-10 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-600 p-3 rounded-full mb-4 shadow-lg shadow-indigo-200">
                        <Activity size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Sign in to MedicCare System</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center text-sm font-medium border border-red-100">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@hms.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-3 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md mt-4"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
                        Register here
                    </Link>
                </p>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs text-center text-gray-400 mb-2">Test Credentials</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-center text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span>Admin: admin@test.com</span>
                        <span>Doc: doc@test.com</span>
                        <span>Pat: pat@test.com</span>
                        <span className="col-span-2 text-indigo-500 font-medium mt-1">Pass: 123456</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
