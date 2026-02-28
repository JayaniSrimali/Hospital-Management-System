import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { Calendar, Users, Clipboard } from 'lucide-react';

const DoctorHome = ({ user }) => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const res = await axios.get('http://localhost:5000/api/appointments', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAppointments(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-md p-6 text-white flex items-center justify-between">
                    <div>
                        <p className="text-indigo-100 font-medium">My Appointments</p>
                        <h3 className="text-4xl font-bold mt-2">{appointments.length}</h3>
                    </div>
                    <Calendar size={48} className="text-indigo-200" opacity={0.8} />
                </div>
                <div className="bg-gradient-to-br from-teal-400 to-teal-500 rounded-xl shadow-md p-6 text-white flex items-center justify-between">
                    <div>
                        <p className="text-teal-100 font-medium">Total Patients</p>
                        <h3 className="text-4xl font-bold mt-2">{new Set(appointments.map(a => a.patient?._id)).size}</h3>
                    </div>
                    <Users size={48} className="text-teal-200" opacity={0.8} />
                </div>
                <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl shadow-md p-6 text-white flex items-center justify-between">
                    <div>
                        <p className="text-orange-100 font-medium">Pending Approvals</p>
                        <h3 className="text-4xl font-bold mt-2">
                            {appointments.filter(a => a.status === 'Pending').length}
                        </h3>
                    </div>
                    <Clipboard size={48} className="text-orange-200" opacity={0.8} />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Upcoming Appointments</h3>
                {appointments.length === 0 ? (
                    <p className="text-gray-500 py-4 text-center">No appointments found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-medium rounded-tl-lg">Patient</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Time</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium rounded-tr-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {appointments.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">{app.patient?.name || 'Unknown'}</td>
                                        <td className="p-4">{new Date(app.date).toLocaleDateString()}</td>
                                        <td className="p-4">{app.time}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                app.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                    app.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const DoctorDashboard = ({ user }) => {
    return (
        <Routes>
            <Route path="/" element={<DoctorHome user={user} />} />
            <Route path="/appointments" element={<div className="p-6 bg-white rounded-xl shadow-sm">Manage Appointments (Coming Soon)</div>} />
            <Route path="/prescriptions" element={<div className="p-6 bg-white rounded-xl shadow-sm">Write Prescriptions (Coming Soon)</div>} />
        </Routes>
    );
};

export default DoctorDashboard;
