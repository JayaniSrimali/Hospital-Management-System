import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';
import { Calendar, FileText, CreditCard, PlusCircle, Activity, ShieldCheck, Clock, CheckCircle, AlertCircle, Users, User, Bell, Settings, Search, ChevronRight } from 'lucide-react';


// --- 1. PATIENT HOME OVERVIEW ---
const PatientHome = ({ user }) => {
    const [stats, setStats] = useState({ appointments: [], prescriptions: [], bills: [], doctors: [] });
    const [showBooking, setShowBooking] = useState(false);
    const [bookingData, setBookingData] = useState({ doctorId: '', date: '', time: '', reason: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const [appRes, docRes, rxRes, billRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/appointments', config),
                    axios.get('http://localhost:5000/api/doctors', config),
                    axios.get('http://localhost:5000/api/prescriptions', config),
                    axios.get('http://localhost:5000/api/billing', config)
                ]);
                setStats({
                    appointments: appRes.data,
                    doctors: docRes.data,
                    prescriptions: rxRes.data,
                    bills: billRes.data
                });
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
            setStats({ ...stats, appointments: [...stats.appointments, res.data] });
            setShowBooking(false);
            setBookingData({ doctorId: '', date: '', time: '', reason: '' });
            alert('Appointment booked successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Booking failed');
        }
    };

    const pendingBills = stats.bills.filter(b => b.status === 'Unpaid' || b.status === 'Pending').length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-emerald-900">Dashboard Overview</h2>
                <button
                    onClick={() => setShowBooking(!showBooking)}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white px-5 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-900 shadow-md hover:shadow-emerald-900/20 transition-all active:scale-95 font-semibold"
                >
                    <PlusCircle size={20} />
                    <span>Book Appointment</span>
                </button>
            </div>

            {showBooking && (
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-emerald-100 border-t-4 border-t-emerald-600 mb-6 slide-down">
                    <h3 className="text-xl font-bold mb-5 text-emerald-900">Schedule New Appointment</h3>
                    <form onSubmit={handleBook} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-emerald-800">Select Doctor</label>
                            <select
                                className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-50/30 transition-shadow outline-none text-emerald-900"
                                required
                                value={bookingData.doctorId}
                                onChange={(e) => setBookingData({ ...bookingData, doctorId: e.target.value })}
                            >
                                <option value="">Select Doctor</option>
                                {stats.doctors.map(d => (
                                    <option key={d._id} value={d.user._id}>Dr. {d.user.name} ({d.specialization})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-emerald-800">Date</label>
                            <input
                                type="date"
                                className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-50/30 transition-shadow outline-none text-emerald-900"
                                required
                                value={bookingData.date}
                                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-emerald-800">Time</label>
                            <input
                                type="time"
                                className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-50/30 transition-shadow outline-none text-emerald-900"
                                required
                                value={bookingData.time}
                                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-emerald-800">Reason</label>
                            <input
                                type="text"
                                className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-emerald-50/30 transition-shadow outline-none text-emerald-900"
                                value={bookingData.reason}
                                onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                                placeholder="Briefly describe your symptoms"
                            />
                        </div>
                        <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-emerald-50">
                            <button
                                type="button"
                                onClick={() => setShowBooking(false)}
                                className="px-5 py-2.5 text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all font-bold"
                            >
                                Confirm Booking
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to="/patient/appointments" className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl shadow-lg shadow-emerald-900/10 p-6 text-white hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-emerald-100 text-lg">My Appointments</h3>
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm"><Calendar size={24} className="text-emerald-50" /></div>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-5xl font-extrabold">{stats.appointments.length}</p>
                        <p className="text-emerald-200 font-medium mb-1">Total Booked</p>
                    </div>
                </Link>

                <Link to="/patient/prescriptions" className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl shadow-lg shadow-teal-900/10 p-6 text-white hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-teal-100 text-lg">Prescriptions</h3>
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm"><FileText size={24} className="text-teal-50" /></div>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-5xl font-extrabold">{stats.prescriptions.length}</p>
                        <p className="text-teal-200 font-medium mb-1">Received</p>
                    </div>
                </Link>

                <Link to="/patient/billing" className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl shadow-lg shadow-green-900/10 p-6 text-white hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-green-100 text-lg">Pending Bills</h3>
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm"><CreditCard size={24} className="text-green-50" /></div>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-5xl font-extrabold">{pendingBills}</p>
                        <p className="text-green-200 font-medium mb-1">Unpaid Dues</p>
                    </div>
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 overflow-hidden mt-8">
                <div className="flex justify-between items-center mb-6 border-b border-emerald-50 pb-4">
                    <h3 className="text-xl font-bold text-emerald-900">Recent Appointments</h3>
                    <Link to="/patient/appointments" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors">View All &rarr;</Link>
                </div>
                {stats.appointments.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Calendar size={28} className="text-emerald-300" />
                        </div>
                        <p className="text-emerald-600 font-medium">No appointments found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-emerald-50/50 text-emerald-800 border-y border-emerald-100">
                                <tr>
                                    <th className="p-4 font-bold rounded-l-lg">Doctor</th>
                                    <th className="p-4 font-bold">Date & Time</th>
                                    <th className="p-4 font-bold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {stats.appointments.slice(-5).reverse().map((app) => (
                                    <tr key={app._id} className="hover:bg-emerald-50/30 transition-colors">
                                        <td className="p-4 font-semibold text-emerald-900">
                                            Dr. {app.doctor?.name || 'Unknown'}
                                        </td>
                                        <td className="p-4 text-emerald-700 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-emerald-400" />
                                                {new Date(app.date).toLocaleDateString()} at {app.time}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${app.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                app.status === 'Approved' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                    app.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-rose-100 text-rose-700 border border-rose-200'
                                                }`}>
                                                {app.status === 'Completed' && <CheckCircle size={12} />}
                                                {app.status === 'Pending' && <AlertCircle size={12} />}
                                                {app.status}
                                            </span>
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

// --- 2. APPOINTMENTS PAGE ---
const AppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">Appointment History</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 overflow-hidden">
                {loading ? (
                    <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></div>
                ) : appointments.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar size={48} className="text-emerald-200 mx-auto mb-4" />
                        <p className="text-emerald-600 font-medium text-lg">You haven't booked any appointments yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-emerald-50 text-emerald-800">
                                <tr>
                                    <th className="p-4 font-bold rounded-l-lg">Doctor</th>
                                    <th className="p-4 font-bold">Date</th>
                                    <th className="p-4 font-bold">Time</th>
                                    <th className="p-4 font-bold">Reason</th>
                                    <th className="p-4 font-bold rounded-r-lg">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {appointments.map(app => (
                                    <tr key={app._id} className="hover:bg-emerald-50/50 transition-colors">
                                        <td className="p-4 font-semibold text-emerald-900 border-l border-transparent">Dr. {app.doctor?.name || 'Unknown'}</td>
                                        <td className="p-4 text-emerald-700 font-medium">{new Date(app.date).toLocaleDateString()}</td>
                                        <td className="p-4 text-emerald-700">{app.time}</td>
                                        <td className="p-4 text-emerald-600 max-w-xs truncate">{app.reason || '-'}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${app.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                app.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                                    app.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                                }`}>{app.status}</span>
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

// --- 3. PRESCRIPTIONS PAGE ---
const PrescriptionsList = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const res = await axios.get('http://localhost:5000/api/prescriptions', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPrescriptions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">My Medical Prescriptions</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                {loading ? (
                    <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></div>
                ) : prescriptions.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText size={48} className="text-emerald-200 mx-auto mb-4" />
                        <p className="text-emerald-600 font-medium text-lg">No prescriptions recorded.</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {prescriptions.map(rx => (
                            <div key={rx._id} className="border border-emerald-100 rounded-2xl p-6 bg-gradient-to-br from-white to-emerald-50/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <FileText size={100} />
                                </div>
                                <div className="flex justify-between items-start mb-4 border-b border-emerald-100 pb-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-emerald-900">Dr. {rx.doctor?.name || 'Unknown'}</h4>
                                        <p className="text-emerald-600 text-sm font-medium mt-1">Prescribed on: {new Date(rx.appointment?.date || rx.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div>
                                    <h5 className="font-bold text-emerald-800 mb-3 flex items-center gap-2">
                                        <Activity size={16} className="text-teal-500" /> Prescribed Medicines
                                    </h5>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                                        {rx.medicines.map((med, idx) => (
                                            <li key={idx} className="bg-white border border-emerald-100 p-3 rounded-xl flex flex-col shadow-sm">
                                                <span className="font-bold text-emerald-900">{med.name}</span>
                                                <span className="text-sm font-medium text-emerald-600 mt-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-md">{med.dosage} - {med.instructions}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {rx.notes && (
                                        <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-100">
                                            <span className="text-xs font-bold text-teal-800 uppercase tracking-wider mb-1 block">Doctor's Notes</span>
                                            <p className="text-teal-900 font-medium text-sm">{rx.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 4. BILLING PAGE ---
const BillingList = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const res = await axios.get('http://localhost:5000/api/billing', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBills(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBills();
    }, []);

    const handlePay = async (id) => {
        const token = JSON.parse(localStorage.getItem('userInfo')).token;
        try {
            await axios.put(`http://localhost:5000/api/billing/${id}/pay`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBills(bills.map(b => b._id === id ? { ...b, status: 'Paid' } : b));
            alert('Payment processed successfully!');
        } catch (err) {
            alert('Payment failed. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">Financial Records & Billing</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
                {loading ? (
                    <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></div>
                ) : bills.length === 0 ? (
                    <div className="text-center py-12">
                        <CreditCard size={48} className="text-emerald-200 mx-auto mb-4" />
                        <p className="text-emerald-600 font-medium text-lg">No billing records found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-emerald-50 text-emerald-800">
                                <tr>
                                    <th className="p-4 font-bold rounded-l-lg">Date</th>
                                    <th className="p-4 font-bold">Description</th>
                                    <th className="p-4 font-bold">Amount</th>
                                    <th className="p-4 font-bold">Status</th>
                                    <th className="p-4 font-bold rounded-r-lg text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {bills.map(bill => (
                                    <tr key={bill._id} className="hover:bg-emerald-50/50 transition-colors">
                                        <td className="p-4 text-emerald-700 font-medium">
                                            {bill.appointment ? new Date(bill.appointment.date).toLocaleDateString() : new Date(bill.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 font-semibold text-emerald-900">{bill.description || 'Consultation processing'}</td>
                                        <td className="p-4 font-bold text-emerald-700">${bill.amount}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block ${bill.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700 border border-rose-200'
                                                }`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            {bill.status !== 'Paid' ? (
                                                <button
                                                    onClick={() => handlePay(bill._id)}
                                                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-emerald-700 transition-colors active:scale-95"
                                                >
                                                    Pay Now
                                                </button>
                                            ) : (
                                                <span className="text-emerald-500 font-bold flex items-center justify-end gap-1 text-sm">
                                                    <CheckCircle size={16} /> Paid
                                                </span>
                                            )}
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


// --- 5. NEW PAGES PLACEHOLDERS ---
const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const res = await axios.get('http://localhost:5000/api/doctors', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDoctors(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">Our Specialists</h2>

            {loading ? (
                <div className="py-12 flex justify-center"><div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></div>
            ) : doctors.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-12 text-center shadow-[0_4px_20px_rgba(16,185,129,0.05)]">
                    <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-emerald-100 shadow-inner">
                        <Users size={40} className="text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-extrabold text-emerald-900 mb-3 tracking-tight">No Doctors Available</h3>
                    <p className="text-emerald-600 font-medium mb-8 max-w-md mx-auto">We couldn't find any medical professionals in the directory at this moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map(doc => (
                        <div key={doc._id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-emerald-100 overflow-hidden group">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-md group-hover:scale-105 transition-transform duration-300">
                                        {doc.user?.name?.charAt(0) || 'D'}
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
                                        ⭐ {doc.experience} Yrs Exp
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-emerald-950 mb-1">Dr. {doc.user?.name || 'Unknown'}</h3>
                                <p className="text-emerald-600 font-semibold mb-4">{doc.specialization}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium bg-emerald-50/50 p-2 rounded-lg border border-emerald-50">
                                        <FileText size={16} className="text-emerald-500" /> {doc.education}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-emerald-700 font-medium bg-emerald-50/50 p-2 rounded-lg border border-emerald-50">
                                        <CreditCard size={16} className="text-emerald-500" /> Consultation: <span className="font-bold text-emerald-900">${doc.fees}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 px-4 py-2.5 rounded-xl font-bold transition-colors duration-300 active:scale-95 flex items-center justify-center gap-2">
                                    <Calendar size={18} /> Book Appointment
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const MedicalReports = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-emerald-900 mb-6">Medical Lab Reports</h2>
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-12 text-center shadow-[0_4px_20px_rgba(16,185,129,0.05)]">
            <div className="bg-teal-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-teal-100 shadow-inner">
                <FileText size={40} className="text-teal-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-emerald-900 mb-3 tracking-tight">No Reports Available</h3>
            <p className="text-emerald-600 font-medium max-w-md mx-auto">Your lab, scanning, and diagnostic reports will securely appear here once uploaded by your doctor or the laboratory department.</p>
        </div>
    </div>
);

const MyProfile = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Patient User',
        email: user?.email || 'patient@medicare.com',
        phone: '+1 (555) 123-4567',
        dob: '1988-05-15',
        address: '123 Emerald Avenue, Suite 4B, New York, NY 10001',
        emergencyContact: 'John Smith - +1 (555) 987-6543 (Husband)'
    });

    const handleSave = () => {
        setIsEditing(false);
        // Add actual API call here to save modified details later.
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">Patient Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-center md:col-span-1 border-t-4 border-t-emerald-500">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-5xl shadow-inner mb-4">
                        {profileData.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-extrabold text-emerald-900">{profileData.name}</h3>
                    <p className="text-emerald-600 font-medium mb-4">{profileData.email}</p>
                    <div className="inline-flex py-1 px-4 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700 capitalize border border-emerald-200">
                        {user?.role || 'Patient'} Account
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 md:col-span-2">
                    <h3 className="text-lg font-bold text-emerald-900 mb-6 border-b border-emerald-50 pb-3 flex justify-between items-center">
                        Personal Information
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`text-sm font-bold px-4 py-1.5 rounded-lg transition-colors ${isEditing ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-50 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100'}`}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Full Name</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-3 bg-white rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-emerald-900 font-semibold shadow-sm transition-all"
                                    value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 text-emerald-900 font-medium">{profileData.name}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Email Address</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-3 bg-white rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-emerald-900 font-semibold shadow-sm transition-all"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 text-emerald-900 font-medium">{profileData.email}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Phone Number</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-3 bg-white rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-emerald-900 font-semibold shadow-sm transition-all"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 text-emerald-900 font-medium">{profileData.phone}</div>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Date of Birth</label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    className="w-full p-3 bg-white rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-emerald-900 font-semibold shadow-sm transition-all"
                                    value={profileData.dob}
                                    onChange={(e) => setProfileData({ ...profileData, dob: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 text-emerald-900 font-medium">{new Date(profileData.dob).toLocaleDateString()}</div>
                            )}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Residential Address</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-3 bg-white rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-emerald-900 font-semibold shadow-sm transition-all"
                                    value={profileData.address}
                                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 text-emerald-900 font-medium">{profileData.address}</div>
                            )}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Emergency Contact</label>
                            {isEditing ? (
                                <input
                                    className="w-full p-3 bg-white rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-emerald-900 font-semibold shadow-sm transition-all"
                                    value={profileData.emergencyContact}
                                    onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 text-emerald-900 font-medium">{profileData.emergencyContact}</div>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-8 pt-6 border-t border-emerald-50 flex justify-end gap-4 slide-down">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 text-emerald-700 hover:bg-emerald-50 rounded-xl font-bold transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
                            >
                                <CheckCircle size={18} /> Update Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Notifications = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-900">Notifications</h2>
            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100">Mark all as read</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="flex flex-col">
                <div className="p-6 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors flex gap-4 items-start relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0 mt-1 shadow-sm"><Clock size={24} /></div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-emerald-900 text-lg">Upcoming Appointment Reminder</h4>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">2 hours ago</span>
                        </div>
                        <p className="text-emerald-700 font-medium">You have an upcoming general consultation with Dr. Smith scheduled for tomorrow at 10:00 AM.</p>
                        <div className="mt-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-sm font-bold text-blue-700 bg-blue-100 px-4 py-1.5 rounded-lg hover:bg-blue-200 transition-colors">View Details</button>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors flex gap-4 items-start relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 shrink-0 mt-1 shadow-sm"><CheckCircle size={24} /></div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-emerald-900 text-lg">Lab Results Available</h4>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Yesterday</span>
                        </div>
                        <p className="text-emerald-700 font-medium">Your recent Complete Blood Count (CBC) test results have been uploaded by the laboratory.</p>
                        <div className="mt-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-sm font-bold text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors">View Reports</button>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors flex gap-4 items-start relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                    <div className="bg-rose-100 p-3 rounded-full text-rose-600 shrink-0 mt-1 shadow-sm"><AlertCircle size={24} /></div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-emerald-900 text-lg">Payment Overdue</h4>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">3 days ago</span>
                        </div>
                        <p className="text-emerald-700 font-medium">You have an outstanding balance of $45.00 from your previous consultation. Please settle it soon.</p>
                        <div className="mt-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-sm font-bold text-rose-700 bg-rose-100 px-4 py-1.5 rounded-lg hover:bg-rose-200 transition-colors">Pay Now</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const PatientSettings = () => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-emerald-900 mb-6">Account Settings</h2>

        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="p-8 border-b border-emerald-50">
                <h3 className="text-xl font-extrabold text-emerald-900 mb-2 flex items-center gap-3">
                    <ShieldCheck size={24} className="text-emerald-500" /> Security & Password
                </h3>
                <p className="text-emerald-600 text-sm mb-6 font-medium">Ensure your account is using a long, random password to stay secure.</p>

                <div className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-bold text-emerald-800 mb-1">Current Password</label>
                        <input type="password" placeholder="••••••••" className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900 bg-emerald-50/30" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-emerald-800 mb-1">New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900 bg-emerald-50/30" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-emerald-800 mb-1">Confirm New Password</label>
                        <input type="password" placeholder="••••••••" className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900 bg-emerald-50/30" />
                    </div>
                    <div className="pt-2">
                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95">
                            Update Password
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-8 border-b border-emerald-50">
                <h3 className="text-xl font-extrabold text-emerald-900 mb-2 flex items-center gap-3">
                    <Bell size={24} className="text-emerald-500" /> Notification Preferences
                </h3>
                <p className="text-emerald-600 text-sm mb-6 font-medium">Control what alerts you receive and how you receive them.</p>

                <div className="space-y-4 max-w-lg">
                    <label className="flex items-center justify-between p-4 border border-emerald-100 rounded-xl hover:bg-emerald-50/50 cursor-pointer transition-colors">
                        <div>
                            <span className="font-bold text-emerald-900 block">Upcoming Appointments</span>
                            <span className="text-xs text-emerald-600 font-medium">Get SMS & Email reminders 24h before visits.</span>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                    </label>
                    <label className="flex items-center justify-between p-4 border border-emerald-100 rounded-xl hover:bg-emerald-50/50 cursor-pointer transition-colors">
                        <div>
                            <span className="font-bold text-emerald-900 block">Medical Report Uploads</span>
                            <span className="text-xs text-emerald-600 font-medium">Alert me immediately when lab results are ready.</span>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                    </label>
                    <label className="flex items-center justify-between p-4 border border-emerald-100 rounded-xl hover:bg-emerald-50/50 cursor-pointer transition-colors">
                        <div>
                            <span className="font-bold text-emerald-900 block">Billing Alerts</span>
                            <span className="text-xs text-emerald-600 font-medium">Receive notifications about pending invoices.</span>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                    </label>
                </div>
            </div>

            <div className="p-8 bg-rose-50/30">
                <h3 className="text-xl font-extrabold text-rose-700 mb-2">Danger Zone</h3>
                <p className="text-rose-600/80 text-sm mb-5 font-medium">Once you delete your account, there is no going back. All data will be permanently erased.</p>
                <button className="bg-white border-2 border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
                    Delete Account Permanently
                </button>
            </div>
        </div>
    </div>
);

// --- MAIN DASHBOARD ROUTER ---
const PatientDashboard = ({ user }) => {
    return (
        <Routes>
            <Route path="/" element={<PatientHome user={user} />} />
            <Route path="appointments" element={<AppointmentsList />} />
            <Route path="doctors" element={<DoctorsList />} />
            <Route path="prescriptions" element={<PrescriptionsList />} />
            <Route path="reports" element={<MedicalReports />} />
            <Route path="billing" element={<BillingList />} />
            <Route path="profile" element={<MyProfile user={user} />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<PatientSettings />} />
        </Routes>
    );
};

export default PatientDashboard;
