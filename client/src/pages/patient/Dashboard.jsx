import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { Calendar, FileText, CreditCard, PlusCircle } from 'lucide-react';

const PatientHome = ({ user }) => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [showBooking, setShowBooking] = useState(false);
    const [bookingData, setBookingData] = useState({ doctorId: '', date: '', time: '', reason: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const [appRes, docRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/appointments', {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get('http://localhost:5000/api/doctors', {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                setAppointments(appRes.data);
                setDoctors(docRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleBook = async (e) => {
        e.preventDefault();
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            const res = await axios.post('http://localhost:5000/api/appointments', bookingData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments([...appointments, res.data]);
            setShowBooking(false);
            setBookingData({ doctorId: '', date: '', time: '', reason: '' });
            alert('Appointment booked successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Booking failed');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Overview</h2>
                <button
                    onClick={() => setShowBooking(!showBooking)}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 shadow-md transition-all active:scale-95 font-medium"
                >
                    <PlusCircle size={20} />
                    <span>Book Appointment</span>
                </button>
            </div>

            {showBooking && (
                <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-indigo-500 mb-6 slide-down">
                    <h3 className="text-xl font-bold mb-4 text-gray-800">New Appointment</h3>
                    <form onSubmit={handleBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-600">Doctor</label>
                            <select
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                                required
                                value={bookingData.doctorId}
                                onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map(d => (
                                    <option key={d._id} value={d.user._id}>Dr. {d.user.name} ({d.specialization})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-600">Date</label>
                            <input
                                type="date"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                                required
                                value={bookingData.date}
                                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-600">Time</label>
                            <input
                                type="time"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                                required
                                value={bookingData.time}
                                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-600">Reason</label>
                            <input
                                type="text"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow outline-none"
                                value={bookingData.reason}
                                onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                                placeholder="Brief description"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={() => setShowBooking(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-colors font-medium"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-blue-100">Appointments</h3>
                        <Calendar size={24} className="text-blue-200" />
                    </div>
                    <p className="text-4xl font-bold">{appointments.length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-purple-100">Prescriptions</h3>
                        <FileText size={24} className="text-purple-200" />
                    </div>
                    <p className="text-4xl font-bold">--</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-green-100">Pending Bills</h3>
                        <CreditCard size={24} className="text-green-200" />
                    </div>
                    <p className="text-4xl font-bold">--</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                <h3 className="text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-3">Recent Appointments</h3>
                {appointments.length === 0 ? (
                    <p className="text-gray-500 py-4 text-center">No appointments found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-medium rounded-tl-lg">Doctor</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Time</th>
                                    <th className="p-4 font-medium">Status</th>
                                    <th className="p-4 font-medium rounded-tr-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {appointments.map((app) => (
                                    <tr key={app._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium text-gray-800">Dr. {app.doctor?.name || 'Unknown'}</td>
                                        <td className="p-4 text-gray-600">{new Date(app.date).toLocaleDateString()}</td>
                                        <td className="p-4 text-gray-600">{app.time}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    app.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                        app.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">Cancel</button>
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

const PatientDashboard = ({ user }) => {
    return (
        <Routes>
            <Route path="/" element={<PatientHome user={user} />} />
            <Route path="/appointments" element={<div className="p-6 bg-white rounded-xl shadow-sm">My Appointments (Coming Soon)</div>} />
            <Route path="/prescriptions" element={<div className="p-6 bg-white rounded-xl shadow-sm">My Prescriptions (Coming Soon)</div>} />
            <Route path="/billing" element={<div className="p-6 bg-white rounded-xl shadow-sm">My Bills (Coming Soon)</div>} />
        </Routes>
    );
};

export default PatientDashboard;
