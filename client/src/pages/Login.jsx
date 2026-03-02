import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, ShieldCheck, Mail, Lock } from 'lucide-react';
import loginImage from '../assets/images/Login.jpg';

const API_BASE_URL = import.meta.env.PROD
    ? 'https://hospital-management-api-xi.vercel.app/api'
    : 'http://localhost:5000/api';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_BASE_URL}/auth/login`, {
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800 font-sans relative overflow-hidden">
            {/* Background Ambient Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-200/40 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-200/40 blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-5xl grid md:grid-cols-2 bg-white/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden relative z-10 mx-4 sm:mx-6">

                {/* Left Side - Branding & Logo */}
                <div
                    className="hidden md:flex flex-col justify-center items-center p-12 relative bg-cover bg-center border-r border-gray-100"
                    style={{ backgroundImage: `url(${loginImage})` }}
                >
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px]"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="mb-8 relative group">
                            <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xl group-hover:bg-emerald-400/30 transition-all duration-500"></div>
                            <div className="relative bg-white p-6 rounded-3xl border border-gray-200 shadow-xl flex items-center justify-center">
                                <Activity size={56} className="text-emerald-500 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
                                <ShieldCheck size={28} className="text-teal-500 absolute bottom-4 right-4 bg-white rounded-full" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 tracking-tight mb-4 text-center">
                            MediCare.Sys
                        </h1>
                        <p className="text-gray-600 font-medium text-center text-lg leading-relaxed max-w-sm">
                            Advanced healthcare management, secured. Access your dashboard to manage appointments, patients, and records.
                        </p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="p-10 sm:p-14 flex flex-col justify-center bg-white">
                    <div className="md:hidden flex flex-col items-center mb-10">
                        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-md mb-4 bg-gradient-to-br from-white to-gray-50">
                            <Activity size={32} className="text-emerald-500" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">MediCare.Sys</h2>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Welcome Back</h2>
                        <p className="text-gray-500">Please enter your credentials to continue.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700 pl-1">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder-gray-400 hover:border-gray-300"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@test.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center pl-1 pr-1">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <Link to="/forgot-password" className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors font-medium">Forgot password?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder-gray-400 hover:border-gray-300"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500 hover:border-emerald-600 py-3.5 rounded-xl font-bold active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg relative overflow-hidden group mt-4"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Sign In
                            </span>
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-all">
                            Create one now
                        </Link>
                    </p>


                </div>
            </div>
        </div>
    );
};

export default Login;
