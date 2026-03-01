import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
    Calendar, Users, Clipboard, Pill, FileText, Activity,
    CheckCircle, XCircle, Clock, Search, PlusCircle,
    ArrowRight, ChevronRight, Filter, TrendingUp, Info, Download,
    ShieldCheck, Bell, AlertCircle
} from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    PointElement, LineElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement,
    LineElement, ArcElement, Title, Tooltip, Legend
);

// --- UTILS ---
const getToken = () => JSON.parse(localStorage.getItem('userInfo'))?.token;
const config = () => ({ headers: { Authorization: `Bearer ${getToken()}` } });

// --- TOAST COMPONENT ---
const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isError = type === 'error';

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md pointer-events-none">
            <div className={`toast-slide-in flex items-center gap-4 p-5 rounded-2xl shadow-2xl border-2 pointer-events-auto bg-white ${isError ? 'border-rose-100 text-rose-900 shadow-rose-950/10' : 'border-emerald-100 text-emerald-900 shadow-emerald-950/10'
                }`}>
                <div className={`p-3 rounded-xl flex-shrink-0 ${isError ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {isError ? <XCircle size={24} /> : <CheckCircle size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-sm uppercase tracking-wider mb-0.5">{isError ? 'Error' : 'Success'}</p>
                    <p className="text-sm font-bold opacity-90 leading-tight">{message}</p>
                </div>
                <button
                    onClick={onClose}
                    className={`p-2 rounded-lg transition-colors ${isError ? 'hover:bg-rose-50 text-rose-300 hover:text-rose-500' : 'hover:bg-emerald-50 text-emerald-300 hover:text-emerald-500'}`}
                >
                    <XCircle size={20} />
                </button>
            </div>
        </div>
    );
};

// --- 1. DOCTOR HOME OVERVIEW ---
const DoctorHome = ({ user }) => {
    const [allAppointments, setAllAppointments] = useState([]);
    const [stats, setStats] = useState({ patients: 0, revenue: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/appointments', config());
                const apps = res.data;
                const uniquePatients = new Set(apps.map(a => a.patient?._id)).size;
                const pendingApps = apps.filter(a => a.status === 'Pending').length;

                setAllAppointments(apps);
                setStats({
                    patients: uniquePatients,
                    pending: pendingApps,
                    revenue: apps.filter(a => a.status === 'Completed').length * 1500 // Simulated revenue
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="py-20 flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <h2 className="text-xl md:text-2xl font-black text-emerald-950 uppercase tracking-tight">Overview</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Link to="/doctor/patients" className="bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl shadow-lg shadow-emerald-900/10 p-6 text-white hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-emerald-100 text-lg">Total Patients</h3>
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm"><Users size={24} className="text-emerald-50" /></div>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-5xl font-extrabold">{stats.patients}</p>
                        <p className="text-emerald-200 font-medium mb-1">Registered</p>
                    </div>
                </Link>

                <Link to="/doctor/appointments" className="bg-gradient-to-br from-teal-700 to-teal-900 rounded-2xl shadow-lg shadow-teal-900/10 p-6 text-white hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-teal-100 text-lg">Appointments</h3>
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm"><Calendar size={24} className="text-teal-50" /></div>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-5xl font-extrabold">{allAppointments.length}</p>
                        <p className="text-teal-200 font-medium mb-1">Total Booked</p>
                    </div>
                </Link>

                <Link to="/doctor/appointments" className="bg-gradient-to-br from-amber-600 to-amber-800 rounded-2xl shadow-lg shadow-amber-900/10 p-6 text-white hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-amber-100 text-lg">Pending</h3>
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm"><Clock size={24} className="text-amber-50" /></div>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-5xl font-extrabold">{stats.pending}</p>
                        <p className="text-amber-200 font-medium mb-1">Actions Required</p>
                    </div>
                </Link>

                <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-2xl shadow-lg shadow-blue-900/10 p-6 text-white hover:scale-[1.02] transition-transform">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-blue-100 text-lg">Revenue</h3>
                        <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm"><TrendingUp size={24} className="text-blue-50" /></div>
                    </div>
                    <div className="flex items-end gap-3">
                        <p className="text-3xl font-extrabold">Rs.{stats.revenue}</p>
                        <p className="text-blue-200 font-medium mb-1">Estimated</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 overflow-hidden mt-8">
                <div className="flex justify-between items-center mb-6 border-b border-emerald-50 pb-4">
                    <h3 className="text-xl font-bold text-emerald-900">Patient Queue</h3>
                    <Link to="/doctor/appointments" className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors">View All &rarr;</Link>
                </div>
                {allAppointments.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Activity size={28} className="text-emerald-300" />
                        </div>
                        <p className="text-emerald-600 font-medium">No queue entries found.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-emerald-50/50 text-emerald-800 border-y border-emerald-100">
                                <tr>
                                    <th className="p-4 font-bold rounded-l-lg">Patient</th>
                                    <th className="p-4 font-bold">Date & Time</th>
                                    <th className="p-4 font-bold text-right rounded-r-lg">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {allAppointments.slice(0, 5).map((app) => (
                                    <tr key={app._id} className="hover:bg-emerald-50/30 transition-colors">
                                        <td className="p-4 font-semibold text-emerald-900">
                                            {app.patient?.name || 'Anonymous'}
                                        </td>
                                        <td className="p-4 text-emerald-700 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-emerald-400" />
                                                {app.time}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <Link to="/doctor/appointments" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold shadow-md hover:bg-emerald-700 transition-colors text-sm">
                                                Begin
                                            </Link>
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

// --- 2. APPOINTMENTS MANAGEMENT ---
const DoctorAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const fetchApps = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/appointments', config());
            setAppointments(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchApps(); }, []);

    const handleStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/appointments/${id}`, { status }, config());
            setToast({ message: `Appointment ${status.toLowerCase()} successfully!`, type: 'success' });
            fetchApps();
        } catch (err) {
            setToast({ message: 'Action failed', type: 'error' });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <h2 className="text-xl md:text-2xl font-black text-emerald-950 uppercase tracking-tight">Appointments</h2>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-0 sm:p-6 overflow-hidden mt-8">
                    <div className="flex justify-between items-center p-6 border-b border-emerald-50 sm:p-0 sm:pb-4 sm:mb-6">
                        <h3 className="text-xl font-bold text-emerald-900">Patient Flow</h3>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-emerald-50/50 text-emerald-800 border-y border-emerald-100">
                                <tr>
                                    <th className="p-4 font-bold rounded-l-lg">Patient Profile</th>
                                    <th className="p-4 font-bold">Consultation Date</th>
                                    <th className="p-4 font-bold">Time Slot</th>
                                    <th className="p-4 font-bold">Clinical Status</th>
                                    <th className="p-4 font-bold text-right rounded-r-lg">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50">
                                {appointments.map((app) => (
                                    <tr key={app._id} className="hover:bg-emerald-50/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-black text-lg">
                                                    {app.patient?.name?.charAt(0) || 'P'}
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-emerald-950">{app.patient?.name || 'Unknown'}</span>
                                                    <span className="text-xs text-emerald-600">ID: {app._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-emerald-700 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-emerald-400" />
                                                <span>{new Date(app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-emerald-700 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-emerald-400" />
                                                <span>{app.time}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${app.status === 'Pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                                                app.status === 'Approved' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                    app.status === 'Completed' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                                                        'bg-rose-100 text-rose-700 border border-rose-200'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'Pending' ? 'bg-amber-500' :
                                                    app.status === 'Approved' ? 'bg-blue-500' :
                                                        app.status === 'Completed' ? 'bg-emerald-500' : 'bg-rose-500'
                                                    }`}></div>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {app.status === 'Pending' && (
                                                    <button onClick={() => handleStatus(app._id, 'Approved')} className="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Approve">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {app.status === 'Approved' && (
                                                    <button onClick={() => handleStatus(app._id, 'Completed')} className="p-2 rounded-lg bg-teal-50 text-teal-600 hover:bg-teal-100 transition-colors" title="Complete">
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                {app.status !== 'Completed' && app.status !== 'Cancelled' && (
                                                    <button onClick={() => handleStatus(app._id, 'Cancelled')} className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors" title="Cancel">
                                                        <XCircle size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

// --- 3. PATIENTS LIST ---
const DoctorPatients = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/appointments', config());
                const uniquePatients = [];
                const ids = new Set();
                res.data.forEach(app => {
                    if (app.patient && !ids.has(app.patient._id)) {
                        ids.add(app.patient._id);
                        uniquePatients.push(app.patient);
                    }
                });
                setPatients(uniquePatients);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchPatients();
    }, []);

    const filtered = patients.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <h2 className="text-xl md:text-2xl font-black text-emerald-950 uppercase tracking-tight">Patient Registry</h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                    <input
                        type="text" placeholder="Search patients..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-emerald-900 transition-all font-medium text-sm shadow-sm"
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white border border-emerald-100 rounded-2xl shadow-sm mt-4">
                            <Users size={40} className="mx-auto text-emerald-200 mb-4" />
                            <p className="text-emerald-900/40 font-bold uppercase tracking-widest text-sm">No records matching registry query</p>
                        </div>
                    ) : (
                        filtered.map(p => (
                            <div key={p._id} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black shadow-inner border border-emerald-100 group-hover:scale-110 transition-transform">
                                            {p.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-emerald-950 truncate">{p.name || 'Anonymous'}</h4>
                                            <p className="text-emerald-600 font-semibold text-xs mt-1 bg-emerald-50 w-fit px-2 py-0.5 rounded-full border border-emerald-100">
                                                {p.gender || 'Pending'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-6 bg-emerald-50/50 p-3 rounded-xl">
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest mb-0.5">Joined</p>
                                            <p className="text-sm font-bold text-emerald-900">{new Date(p.createdAt || Date.now()).getFullYear()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest mb-0.5">Clinic ID</p>
                                            <p className="text-sm font-bold text-emerald-900">#{p._id.slice(-4).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link to={`/doctor/prescriptions?patient=${p._id}`} className="flex-[3] bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl text-center shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5">
                                        Prescribe <ArrowRight size={14} />
                                    </Link>
                                    <button className="flex-1 p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 hover:bg-emerald-100 transition-colors flex items-center justify-center">
                                        <FileText size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// --- 4. PRESCRIPTIONS ---
const DoctorPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({ patientId: '', medicines: [{ name: '', dosage: '' }], notes: '' });
    const [appointments, setAppointments] = useState([]);

    // Read query params
    const location = useLocation();

    const fetchRx = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/prescriptions', config());
            setPrescriptions(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const fetchApps = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/appointments', config());
            const filteredApps = res.data.filter(a => a.status === 'Approved' || a.status === 'Completed');
            setAppointments(filteredApps);

            // Handle pre-fill from URL
            const params = new URLSearchParams(location.search);
            const patientId = params.get('patient');
            if (patientId) {
                setFormData(prev => ({ ...prev, patientId }));
                setShowForm(true);
            }
        } catch (err) { console.error(err); }
    };

    useEffect(() => { fetchRx(); fetchApps(); }, [location.search]);

    const handleAddMedicine = () => setFormData({ ...formData, medicines: [...formData.medicines, { name: '', dosage: '' }] });
    const handleMedChange = (idx, field, value) => {
        const newMeds = [...formData.medicines];
        newMeds[idx][field] = value;
        setFormData({ ...formData, medicines: newMeds });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const selectedApp = appointments.find(a => a.patient?._id === formData.patientId);
            await axios.post('http://localhost:5000/api/prescriptions', {
                ...formData,
                appointmentId: selectedApp?._id
            }, config());
            setToast({ message: 'Prescription written successfully!', type: 'success' });
            setShowForm(false);
            fetchRx();
            setFormData({ patientId: '', medicines: [{ name: '', dosage: '' }], notes: '' });
        } catch (err) { setToast({ message: 'Submission failed', type: 'error' }); }
    };

    const filtered = prescriptions.filter(rx => rx.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <h2 className="text-xl md:text-2xl font-black text-emerald-950 uppercase tracking-tight">Prescriptions</h2>
                <div className="flex w-full sm:w-auto gap-3">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                        <input
                            type="text" placeholder="Search prescriptions..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-emerald-900 transition-all font-medium text-sm shadow-sm"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => setShowForm(true)} className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white px-5 py-2 rounded-xl hover:from-emerald-700 hover:to-emerald-900 shadow-md shadow-emerald-900/10 transition-all font-bold text-sm">
                        <PlusCircle size={18} /> <span className="hidden sm:inline">New Rx</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white border border-emerald-100 rounded-2xl shadow-sm mt-4">
                            <Pill size={40} className="mx-auto text-emerald-200 mb-4" />
                            <p className="text-emerald-900/40 font-bold uppercase tracking-widest text-sm">No active prescription records</p>
                        </div>
                    ) : (
                        filtered.map(rx => (
                            <div key={rx._id} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all group flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-110 transition-transform">
                                            <Pill size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-bold text-emerald-950 truncate">{rx.patient?.name || 'Anonymous Patient'}</h4>
                                            <p className="text-xs text-emerald-600 font-semibold">{new Date(rx.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6 bg-emerald-50/50 p-4 rounded-xl">
                                        {rx.medicines?.map((med, i) => (
                                            <div key={i} className="flex justify-between items-center bg-white p-2.5 rounded-lg border border-emerald-100 shadow-sm">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                    <span className="font-bold text-emerald-900 text-sm truncate max-w-[120px]">{med.name}</span>
                                                </div>
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">{med.dosage}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {rx.notes && (
                                        <div className="mb-4">
                                            <p className="text-xs font-bold text-emerald-900/60 uppercase tracking-widest mb-1 flex items-center gap-1">
                                                <Info size={12} /> Notes
                                            </p>
                                            <p className="text-sm text-emerald-800 italic line-clamp-2">"{rx.notes}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in scale-in-95 duration-300">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 sm:p-8 text-white">
                            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                <PlusCircle className="text-emerald-200" /> Create Prescription
                            </h3>
                            <p className="text-emerald-100/80 font-medium text-sm mt-1">Issue a new medical order</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider ml-1">Patient</label>
                                <select
                                    required
                                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-emerald-900 transition-all"
                                    value={formData.patientId} onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                                >
                                    <option value="">Select a patient</option>
                                    {appointments.map(a => a.patient && (
                                        <option key={a.patient._id} value={a.patient._id}>{a.patient.name} ({new Date(a.date).toLocaleDateString()})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider ml-1">Medicines</label>
                                    <button type="button" onClick={handleAddMedicine} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md transition-colors">
                                        <PlusCircle size={14} /> Add item
                                    </button>
                                </div>
                                {formData.medicines.map((med, idx) => (
                                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 group animate-in slide-in-from-left-4 fade-in duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                        <input
                                            placeholder="Medicine Name"
                                            className="px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-emerald-900 transition-all"
                                            value={med.name} onChange={e => handleMedChange(idx, 'name', e.target.value)} required
                                        />
                                        <input
                                            placeholder="Dosage (e.g. 1-0-1)"
                                            className="px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-emerald-900 transition-all"
                                            value={med.dosage} onChange={e => handleMedChange(idx, 'dosage', e.target.value)} required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-emerald-900 uppercase tracking-wider ml-1">Clinical Notes</label>
                                <textarea
                                    rows="3" placeholder="Additional instructions..."
                                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-emerald-900 transition-all resize-none"
                                    value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all border border-emerald-100">Cancel</button>
                                <button type="submit" className="flex-[2] px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all">Issue Prescription</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

// --- 5. REPORTS ---
const DoctorReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/reports', config());
                setReports(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchReports();
    }, []);

    const filtered = reports.filter(r => r.reportName?.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleDownloadPDF = (report) => {
        const doc = new jsPDF();
        const dateStr = new Date(report.createdAt || Date.now()).toLocaleDateString();
        const patientName = report.patient?.name || 'Unknown Patient';

        doc.setFillColor(5, 150, 105);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("Clinical Report", 20, 25);

        doc.setTextColor(11, 21, 18);
        doc.setFontSize(16);
        doc.text(report.reportName || "Medical Report", 20, 60);

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);

        doc.text(`Patient Name: ${patientName}`, 20, 75);
        doc.text(`Registry Date: ${dateStr}`, 20, 85);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(11, 21, 18);
        doc.text("Diagnostic Summary", 20, 105);

        doc.setFont("helvetica", "italic");
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        const splitText = doc.splitTextToSize(
            "This report constitutes a finalized clinical summary. All underlying lab telemetry is synchronized and verifiable via the secure clinical node.",
            170
        );
        doc.text(splitText, 20, 115);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 150);
        doc.text("Generated by Medicare.Sys Secure Node", 105, 280, null, null, "center");

        doc.save(`${report.reportName?.replace(/\s+/g, '_') || 'clinical_report'}_${dateStr.replace(/\//g, '-')}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <h2 className="text-xl md:text-2xl font-black text-emerald-950 uppercase tracking-tight">Clinical Reports</h2>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                    <input
                        type="text" placeholder="Search reports..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-emerald-900 transition-all font-medium text-sm shadow-sm"
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-white border border-emerald-100 rounded-2xl shadow-sm mt-4">
                            <FileText size={40} className="mx-auto text-emerald-200 mb-4" />
                            <p className="text-emerald-900/40 font-bold uppercase tracking-widest text-sm">No matching clinical records found</p>
                        </div>
                    ) : (
                        filtered.map(report => (
                            <div key={report._id} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between group h-full">
                                <div className="mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100 group-hover:scale-110 transition-transform">
                                        <FileText size={24} />
                                    </div>
                                    <h4 className="text-lg font-bold text-emerald-950 truncate mb-3">{report.reportName}</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                                            <Users size={14} className="text-emerald-500" /> {report.patient?.name || 'Unknown Patient'}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 px-1">
                                            <Calendar size={14} className="text-emerald-400" /> {new Date(report.createdAt || Date.now()).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedReport(report)}
                                    className="w-full py-2.5 bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-100 transition-colors border border-emerald-100 flex justify-center items-center gap-2"
                                >
                                    Review File <ArrowRight size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedReport && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in scale-in-95 duration-300">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 sm:p-8 text-white relative">
                            <button onClick={() => setSelectedReport(null)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors z-20">
                                <XCircle size={20} />
                            </button>
                            <FileText size={40} className="mb-4 text-emerald-200 opacity-80" />
                            <h3 className="text-2xl font-black uppercase tracking-tight leading-tight mb-1">{selectedReport.reportName}</h3>
                            <p className="text-emerald-100/80 font-medium text-sm">Confidential Medical Documentation</p>
                        </div>
                        <div className="p-6 sm:p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                    <p className="text-xs font-bold text-emerald-600/60 uppercase tracking-widest mb-1 mt-1">Subject Profile</p>
                                    <p className="text-base font-bold text-emerald-950 truncate mb-1">{selectedReport.patient?.name}</p>
                                </div>
                                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                    <p className="text-xs font-bold text-emerald-600/60 uppercase tracking-widest mb-1 mt-1">Registry Date</p>
                                    <p className="text-base font-bold text-emerald-950 mb-1">{new Date(selectedReport.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="p-5 bg-white border border-emerald-100 shadow-sm rounded-xl">
                                <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                    <Info size={14} className="text-emerald-500" /> Diagnostic Summary
                                </p>
                                <p className="text-sm text-emerald-700 font-medium leading-relaxed italic">
                                    "This report constitutes a finalized clinical summary. All underlying lab telemetry is synchronized and verifiable via the secure clinical node."
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => handleDownloadPDF(selectedReport)}
                                    className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download size={18} /> Download
                                </button>
                                <button onClick={() => setSelectedReport(null)} className="flex-[0.7] py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 transition-colors border border-emerald-100">
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 6. ANALYTICS ---
const DoctorAnalytics = () => {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
                <h2 className="text-xl md:text-2xl font-black text-emerald-950 uppercase tracking-tight">Clinical Analytics</h2>
                <div className="flex gap-2 bg-emerald-50/50 p-1.5 rounded-xl border border-emerald-100 shadow-sm">
                    <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">7 Days</button>
                    <button className="px-4 py-2 rounded-lg text-emerald-700 text-xs font-bold uppercase tracking-wider hover:bg-emerald-100/50 transition-colors">30 Days</button>
                    <button className="px-4 py-2 rounded-lg text-emerald-700 text-xs font-bold uppercase tracking-wider hover:bg-emerald-100/50 transition-colors">All Time</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp size={18} className="text-emerald-500" /> Patient Volume Activity
                        </h3>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md uppercase tracking-wider">+12% vs LW</span>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <Line
                            data={{
                                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                datasets: [{
                                    label: 'Clinical Load',
                                    data: [12, 19, 15, 22, 18, 10, 5],
                                    borderColor: '#059669',
                                    backgroundColor: (context) => {
                                        const chart = context.chart;
                                        const { ctx, chartArea } = chart;
                                        if (!chartArea) return null;
                                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                                        gradient.addColorStop(0, 'rgba(5, 150, 105, 0)');
                                        gradient.addColorStop(1, 'rgba(5, 150, 105, 0.2)');
                                        return gradient;
                                    },
                                    fill: true,
                                    tension: 0.4,
                                    borderWidth: 3,
                                    pointRadius: 0,
                                    pointHoverRadius: 5,
                                    pointHoverBackgroundColor: '#059669',
                                    pointHoverBorderColor: '#fff',
                                    pointHoverBorderWidth: 3
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false }, tooltip: { backgroundColor: '#064e3b', titleFont: { size: 11 }, bodyFont: { size: 12, weight: 'bold' }, padding: 10, borderRadius: 8, displayColors: false } },
                                scales: { x: { grid: { display: false }, ticks: { font: { size: 10, weight: '600' }, color: '#94a3b8' } }, y: { grid: { borderDash: [4, 4], color: '#f1f5f9' }, ticks: { font: { size: 10, weight: '600' }, color: '#94a3b8' } } }
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-widest flex items-center gap-2">
                            <Activity size={18} className="text-emerald-500" /> Service Distribution
                        </h3>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                        <Bar
                            data={{
                                labels: ['General', 'Dental', 'Pediatric', 'Cardiology', 'Surgery'],
                                datasets: [{
                                    label: 'Total Sessions',
                                    data: [45, 32, 28, 18, 12],
                                    backgroundColor: '#10b981',
                                    hoverBackgroundColor: '#059669',
                                    borderRadius: 6,
                                    barThickness: 24
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { x: { grid: { display: false }, ticks: { font: { size: 10, weight: '600' }, color: '#94a3b8' } }, y: { grid: { borderDash: [4, 4], color: '#f1f5f9' }, ticks: { font: { size: 10, weight: '600' }, color: '#94a3b8' } } }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Avg Session Time', value: '18 min', trend: '-2m', icon: Clock },
                    { label: 'Patient Retention', value: '92%', trend: '+0.5%', icon: Users },
                    { label: 'Outcome Efficacy', value: '4.9/5', trend: '+1.2%', icon: CheckCircle },
                    { label: 'No Show Rate', value: '4%', trend: '-1%', icon: XCircle }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-emerald-100 flex items-center justify-between group hover:shadow-md hover:border-emerald-200 transition-all shadow-sm">
                        <div className="flex-1 pr-3">
                            <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest mb-1 truncate">{stat.label}</p>
                            <div className="flex items-center gap-2">
                                <h4 className="text-xl font-black text-emerald-950 tracking-tight">{stat.value}</h4>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{stat.trend}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all flex-shrink-0">
                            <stat.icon size={20} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 7. NOTIFICATIONS ---
const DoctorNotifications = () => (
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
                            <h4 className="font-bold text-emerald-900 text-lg">Upcoming Appointment</h4>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">1 hour ago</span>
                        </div>
                        <p className="text-emerald-700 font-medium">You have an upcoming general consultation with Jane Smith scheduled for today at 2:00 PM.</p>
                        <div className="mt-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-sm font-bold text-blue-700 bg-blue-100 px-4 py-1.5 rounded-lg hover:bg-blue-200 transition-colors">View Patient</button>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors flex gap-4 items-start relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 shrink-0 mt-1 shadow-sm"><CheckCircle size={24} /></div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-emerald-900 text-lg">Report Sync Completed</h4>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Yesterday</span>
                        </div>
                        <p className="text-emerald-700 font-medium">New laboratory test results for John Doe have been synchronized and are available for review.</p>
                        <div className="mt-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-sm font-bold text-emerald-700 bg-emerald-100 px-4 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors">View Report</button>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors flex gap-4 items-start relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                    <div className="bg-rose-100 p-3 rounded-full text-rose-600 shrink-0 mt-1 shadow-sm"><AlertCircle size={24} /></div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-emerald-900 text-lg">Urgent Message</h4>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">2 days ago</span>
                        </div>
                        <p className="text-emerald-700 font-medium">Please finalize the prescription records for patient ID #2041 before the end of the shift.</p>
                        <div className="mt-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-sm font-bold text-rose-700 bg-rose-100 px-4 py-1.5 rounded-lg hover:bg-rose-200 transition-colors">Go to Prescriptions</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- 8. DOCTOR PROFILE ---
const DoctorProfile = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Doctor User',
        email: user?.email || 'doctor@medicare.com',
        phone: '+1 (555) 123-4567',
        specialization: 'General Surgery',
        address: '123 Emerald Avenue, Suite 4B, New York, NY 10001',
        emergencyContact: 'Jane Doe - +1 (555) 987-6543'
    });

    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo')).token;
            await axios.put(`http://localhost:5000/api/auth/profile`, profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditing(false);
            setToast({ message: 'Profile updated successfully!', type: 'success' });
        } catch (err) {
            console.error(err);
            setToast({ message: 'Failed to update profile. Please try again.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">Doctor Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-center md:col-span-1 border-t-4 border-t-emerald-500">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-5xl shadow-inner mb-4">
                        {profileData.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-extrabold text-emerald-900">{profileData.name}</h3>
                    <p className="text-emerald-600 font-medium mb-4">{profileData.email}</p>
                    <div className="inline-flex py-1 px-4 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700 capitalize border border-emerald-200">
                        {user?.role || 'Doctor'} Account
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 md:col-span-2">
                    <h3 className="text-lg font-bold text-emerald-900 mb-6 border-b border-emerald-50 pb-3 flex justify-between items-center">
                        Personal Information
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`text-sm font-bold px-3 py-1.5 sm:px-4 rounded-lg transition-colors ${isEditing ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-50 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100'}`}
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
                            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Specialization</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="w-full p-3 bg-white rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-emerald-900 font-semibold shadow-sm transition-all"
                                    value={profileData.specialization}
                                    onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 text-emerald-900 font-medium">{profileData.specialization}</div>
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
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

// --- 9. ACCOUNT SETTINGS ---
const DoctorSettings = () => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setToast({ message: "New passwords do not match!", type: 'error' });
            return;
        }

        setSaving(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            await axios.put(`http://localhost:5000/api/auth/profile`, { password: passwords.new }, { headers: { Authorization: `Bearer ${token}` } });
            setPasswords({ current: '', new: '', confirm: '' });
            setToast({ message: 'Password updated successfully!', type: 'success' });
        } catch (err) {
            console.error(err);
            setToast({ message: 'Failed to update password. Please try again.', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">Account Settings</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
                <div className="p-8 border-b border-emerald-50">
                    <h3 className="text-xl font-extrabold text-emerald-900 mb-2 flex items-center gap-3">
                        <ShieldCheck size={24} className="text-emerald-500" /> Security & Password
                    </h3>
                    <p className="text-emerald-600 text-sm mb-6 font-medium">Ensure your account is using a long, random password to stay secure.</p>

                    <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-bold text-emerald-800 mb-1">Current Password</label>
                            <input type="password" placeholder="••••••••" required className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900 bg-emerald-50/30" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-emerald-800 mb-1">New Password</label>
                            <input type="password" placeholder="••••••••" required className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900 bg-emerald-50/30" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-emerald-800 mb-1">Confirm New Password</label>
                            <input type="password" placeholder="••••••••" required className="w-full p-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900 bg-emerald-50/30" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md active:scale-95">
                                {saving ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
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
                                <span className="text-xs text-emerald-600 font-medium">Alert me when new patient lab results are available.</span>
                            </div>
                            <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                        </label>
                        <label className="flex items-center justify-between p-4 border border-emerald-100 rounded-xl hover:bg-emerald-50/50 cursor-pointer transition-colors">
                            <div>
                                <span className="font-bold text-emerald-900 block">Staff Announcements</span>
                                <span className="text-xs text-emerald-600 font-medium">Receive important notifications from hospital administration.</span>
                            </div>
                            <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                        </label>
                    </div>
                </div>

                <div className="p-8 bg-rose-50/30">
                    <h3 className="text-xl font-extrabold text-rose-700 mb-2">Danger Zone</h3>
                    <p className="text-rose-600/80 text-sm mb-5 font-medium">Once you delete your account, there is no going back. All patient allocation and history must be reassigned.</p>
                    <button className="bg-white border-2 border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
                        Delete Account Permanently
                    </button>
                </div>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </div>
        </div>
    );
};

// --- MAIN DOCTOR DASHBOARD MANAGER ---
const DoctorDashboard = ({ user }) => {
    return (
        <Routes>
            <Route path="/" element={<DoctorHome user={user} />} />
            <Route path="/appointments" element={<DoctorAppointments />} />
            <Route path="/patients" element={<DoctorPatients />} />
            <Route path="/prescriptions" element={<DoctorPrescriptions />} />
            <Route path="/reports" element={<DoctorReports />} />
            <Route path="/analytics" element={<DoctorAnalytics />} />
            <Route path="/notifications" element={<DoctorNotifications />} />
            <Route path="/profile" element={<DoctorProfile user={user} />} />
            <Route path="/settings" element={<DoctorSettings />} />
        </Routes>
    );
};

export default DoctorDashboard;
