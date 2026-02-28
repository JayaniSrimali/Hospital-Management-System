import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Activity } from 'lucide-react';

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
                // Also create patient record
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12">
            <div className="glass-card p-10 rounded-2xl shadow-xl w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-600 p-3 rounded-full mb-4 shadow-lg shadow-indigo-200">
                        <Activity size={32} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Create Account</h2>
                    <p className="text-gray-500 mt-2">Join MediCare System</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-center text-sm font-medium border border-red-100">{error}</div>}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            name="name" type="text"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            name="email" type="email"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password" type="password"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            name="phone" type="text"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            onChange={handleChange} required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                            name="role"
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            onChange={handleChange}
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white p-3 rounded-xl font-semibold hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-md mt-6"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-center mt-6 text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
