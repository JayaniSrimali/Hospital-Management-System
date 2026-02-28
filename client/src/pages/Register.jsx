import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Activity, ShieldCheck, Mail, Lock, User, Phone, Briefcase } from 'lucide-react';

const Register = ({ setUser }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: 'patient', phone: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            localStorage.setItem('userInfo', JSON.stringify(res.data));
            setUser(res.data);
            if (res.data.role === 'patient') {
                await axios.post('http://localhost:5000/api/patients', {
                    userId: res.data._id,
                    age: 25,
                    gender: 'other',
                    address: 'Update Address',
                }, { headers: { Authorization: `Bearer ${res.data.token}` } });
            }
            navigate(`/${res.data.role}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-gray-100 font-sans relative overflow-hidden py-10">
            {/* Background Ambient Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-teal-900/30 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/30 blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-5xl grid md:grid-cols-2 bg-[#111827]/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-800/50 overflow-hidden relative z-10 mx-6">

                {/* Left Side - Branding & Logo */}
                <div className="hidden md:flex flex-col justify-center items-center p-12 bg-gradient-to-tr from-[#0B0F19] to-[#111827] border-r border-gray-800/50">
                    <div className="mb-8 relative group">
                        <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-2xl group-hover:bg-teal-500/30 transition-all duration-500"></div>
                        <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-3xl border border-gray-700 shadow-xl flex items-center justify-center">
                            <Activity size={56} className="text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
                            <ShieldCheck size={28} className="text-emerald-400 absolute bottom-4 right-4" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300 tracking-tight mb-4 text-center">
                        MediCare.Sys
                    </h1>
                    <p className="text-gray-400 text-center text-lg leading-relaxed max-w-sm">
                        Join our modern healthcare platform. Securely manage your medical journey by creating a new identity.
                    </p>
                </div>

                {/* Right Side - Register Form */}
                <div className="p-10 sm:p-14 flex flex-col justify-center">
                    <div className="md:hidden flex flex-col items-center mb-8">
                        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 shadow-xl mb-4">
                            <Activity size={32} className="text-teal-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-100 tracking-tight">MediCare.Sys</h2>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h2>
                        <p className="text-gray-400">Fill in the details below to securely register.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5 text-left md:col-span-2">
                                <label className="text-sm font-semibold text-gray-300 pl-1">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-teal-400 transition-colors">
                                        <User size={18} />
                                    </div>
                                    <input
                                        name="name" type="text"
                                        className="w-full pl-11 pr-4 py-3 bg-[#0B0F19] text-gray-100 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder-gray-600 shadow-inner"
                                        onChange={handleChange} placeholder="John Doe" required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-sm font-semibold text-gray-300 pl-1">Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-teal-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        name="email" type="email"
                                        className="w-full pl-11 pr-4 py-3 bg-[#0B0F19] text-gray-100 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder-gray-600 shadow-inner"
                                        onChange={handleChange} placeholder="user@mail.com" required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-sm font-semibold text-gray-300 pl-1">Phone</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-teal-400 transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <input
                                        name="phone" type="text"
                                        className="w-full pl-11 pr-4 py-3 bg-[#0B0F19] text-gray-100 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder-gray-600 shadow-inner"
                                        onChange={handleChange} placeholder="+123456789" required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5 text-left">
                                <label className="text-sm font-semibold text-gray-300 pl-1">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-teal-400 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        name="password" type="password"
                                        className="w-full pl-11 pr-4 py-3 bg-[#0B0F19] text-gray-100 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all placeholder-gray-600 shadow-inner"
                                        onChange={handleChange} placeholder="••••••••" required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 text-left">
                                <label className="text-sm font-semibold text-gray-300 pl-1">Role</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-teal-400 transition-colors">
                                        <Briefcase size={18} />
                                    </div>
                                    <select
                                        name="role"
                                        className="w-full pl-11 pr-4 py-3 bg-[#0B0F19] text-gray-100 border border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 outline-none transition-all appearance-none cursor-pointer"
                                        onChange={handleChange}
                                    >
                                        <option value="patient" className="bg-gray-800">Patient</option>
                                        <option value="doctor" className="bg-gray-800">Doctor</option>
                                        <option value="admin" className="bg-gray-800">Admin</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#1F2937] hover:bg-[#273548] text-white border border-gray-600 hover:border-teal-500/50 py-3.5 rounded-xl font-semibold active:scale-[0.98] transition-all duration-200 shadow-lg relative overflow-hidden group mt-6 hover:shadow-teal-900/20"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Register Account
                            </span>
                        </button>
                    </form>

                    <p className="text-center mt-8 text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-teal-400 font-semibold hover:text-teal-300 hover:underline transition-all">
                            Sign in to back
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
