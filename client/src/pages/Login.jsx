import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, ShieldCheck, Mail, Lock } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-gray-100 font-sans relative overflow-hidden">
            {/* Background Ambient Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/30 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-900/30 blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-5xl grid md:grid-cols-2 bg-[#111827]/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-800/50 overflow-hidden relative z-10 mx-6">

                {/* Left Side - Branding & Logo */}
                <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-br from-[#0B0F19] to-[#111827] border-r border-gray-800/50">
                    <div className="mb-8 relative group">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl group-hover:bg-emerald-500/30 transition-all duration-500"></div>
                        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl border border-gray-700 shadow-xl flex items-center justify-center">
                            <Activity size={56} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                            <ShieldCheck size={28} className="text-teal-400 absolute bottom-4 right-4" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 tracking-tight mb-4 text-center">
                        MediCare.Sys
                    </h1>
                    <p className="text-gray-400 text-center text-lg leading-relaxed max-w-sm">
                        Advanced healthcare management, secured. Access your dashboard to manage appointments, patients, and records.
                    </p>
                </div>

                {/* Right Side - Login Form */}
                <div className="p-10 sm:p-14 flex flex-col justify-center">
                    <div className="md:hidden flex flex-col items-center mb-10">
                        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-xl mb-4">
                            <Activity size={32} className="text-emerald-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-100 tracking-tight">MediCare.Sys</h2>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Please enter your credentials to continue.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-300 pl-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    className="w-full pl-11 pr-4 py-3.5 bg-[#0B0F19] text-gray-100 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder-gray-600 shadow-inner"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@test.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center pl-1 pr-1">
                                <label className="text-sm font-semibold text-gray-300">Password</label>
                                <a href="#" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    className="w-full pl-11 pr-4 py-3.5 bg-[#0B0F19] text-gray-100 border border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all placeholder-gray-600 shadow-inner"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#1F2937] hover:bg-[#273548] text-white border border-gray-600 hover:border-emerald-500/50 py-3.5 rounded-xl font-semibold active:scale-[0.98] transition-all duration-200 shadow-lg relative overflow-hidden group mt-4 hover:shadow-emerald-900/20"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Secure Sign In
                            </span>
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-all">
                            Create one now
                        </Link>
                    </p>

                    <div className="mt-10 pt-6 border-t border-gray-800/50">
                        <p className="text-xs text-center text-gray-500 mb-3 font-medium uppercase tracking-wider">Test Credentials</p>
                        <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-400">
                            <span className="bg-[#0B0F19] px-3 py-1.5 rounded-md border border-gray-800">Admin: admin@test.com</span>
                            <span className="bg-[#0B0F19] px-3 py-1.5 rounded-md border border-gray-800">Doc: doc@test.com</span>
                            <span className="bg-[#0B0F19] px-3 py-1.5 rounded-md border border-gray-800">Pat: pat@test.com</span>
                        </div>
                        <div className="text-center mt-3 text-xs text-emerald-500/70">
                            App Password: <span className="font-mono text-emerald-400 ml-1 bg-emerald-500/10 px-2 py-0.5 rounded">123456</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
