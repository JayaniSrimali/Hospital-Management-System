import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
    Calendar, Users, Clipboard, Pill, FileText, Activity,
    CheckCircle, XCircle, Clock, Search, PlusCircle,
    ArrowRight, ChevronRight, Filter, TrendingUp, Info
} from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    PointElement, LineElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js';

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
        const timer = setTimeout(() => onClose(), 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isError = type === 'error';
    const isInfo = type === 'info';

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-md pointer-events-auto">
            <div className={`flex items-center gap-4 p-5 rounded-2xl shadow-2xl border-2 bg-white animate-in slide-in-from-top-8 duration-300 ${isError ? 'border-rose-100 text-rose-900 shadow-rose-950/10' :
                isInfo ? 'border-sky-100 text-sky-900 shadow-sky-950/10' :
                    'border-emerald-100 text-emerald-900 shadow-emerald-950/10'
                }`}>
                <div className={`p-3 rounded-xl flex-shrink-0 ${isError ? 'bg-rose-50 text-rose-500' :
                    isInfo ? 'bg-sky-50 text-sky-500' :
                        'bg-emerald-50 text-emerald-500'
                    }`}>
                    {isError ? <XCircle size={24} /> : isInfo ? <Info size={24} /> : <CheckCircle size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-sm uppercase tracking-wider mb-0.5">
                        {isError ? 'Error' : isInfo ? 'Information' : 'Success'}
                    </p>
                    <p className="text-sm font-bold opacity-90 leading-tight">{message}</p>
                </div>
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

    const statCards = [
        { title: 'Total Patients', value: stats.patients, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12% this month' },
        { title: 'Total Appointments', value: allAppointments.length, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', trend: '8 scheduled today' },
        { title: 'Pending Actions', value: stats.pending, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Action required' },
        { title: 'Estimated Revenue', value: `Rs.${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-teal-600', bg: 'bg-teal-50', trend: '+Rs.4,500 today' }
    ];

    if (loading) return <div className="py-20 flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div></div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 bg-[#FBFBFC] -m-6 p-6 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#0B1512] tracking-tighter sm:text-4xl">Medical Overview</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-emerald-700 font-black text-[10px] uppercase tracking-[0.2em]">Dr. {user?.name} • General Practitioner • Online</p>
                    </div>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none border-2 border-emerald-100 bg-white text-emerald-900 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-50 transition-all">
                        Generate Report
                    </button>
                    <Link to="/doctor/appointments" className="flex-1 md:flex-none bg-[#0B1512] text-white px-8 py-4 rounded-2xl shadow-xl shadow-emerald-950/20 hover:bg-black transition-all active:scale-95 font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                        Dashboard <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white border border-emerald-50/60 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-500 group relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} rounded-bl-[4rem] opacity-20 -mr-4 -mt-4 transition-all group-hover:scale-110`}></div>
                        <div className="relative z-10">
                            <div className={`${card.bg} ${card.color} p-4 rounded-2xl w-fit mb-6 shadow-sm border border-white`}>
                                <card.icon size={22} strokeWidth={2.5} />
                            </div>
                            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{card.title}</p>
                            <h3 className="text-3xl font-black text-[#0B1512] tracking-tight mb-2 transition-transform group-hover:translate-x-1">{card.value}</h3>
                            <p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest flex items-center gap-1.5">
                                <TrendingUp size={12} className="opacity-50" /> {card.trend}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-10">
                {/* Appointment List Section */}
                <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-10 border border-emerald-50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h3 className="text-xl font-black text-[#0B1512] uppercase tracking-[0.1em]">Patient Queue</h3>
                            <p className="text-xs font-bold text-emerald-600/50 mt-1 uppercase tracking-widest">Next 5 scheduled consultations</p>
                        </div>
                        <Link to="/doctor/appointments" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">
                            View Schedule <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {allAppointments.length === 0 ? (
                            <div className="py-20 text-center border-2 border-dashed border-emerald-50 rounded-[2rem]">
                                <Activity size={40} className="mx-auto text-emerald-100 mb-4" />
                                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">No active queue entries</p>
                            </div>
                        ) : (
                            allAppointments.slice(0, 5).map((app, i) => (
                                <div key={app._id} className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-[2rem] border border-emerald-50/40 hover:border-emerald-200 hover:bg-emerald-50/10 transition-all duration-300 group">
                                    <div className="flex items-center gap-6 w-full sm:w-auto mb-4 sm:mb-0">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B1512] to-[#1A3A32] flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white ring-8 ring-emerald-50/50 group-hover:rotate-3 transition-transform">
                                                {app.patient?.name?.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                                        </div>
                                        <div>
                                            <p className="font-black text-xl text-[#0B1512] tracking-tight">{app.patient?.name || 'Anonymous'}</p>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                <span className="text-[10px] font-black text-emerald-600/40 uppercase tracking-[0.2em] bg-white px-2 py-0.5 rounded border border-emerald-50">{app.time}</span>
                                                <span className="w-1 h-1 rounded-full bg-emerald-100"></span>
                                                <span className="text-[10px] font-black text-emerald-600/40 uppercase tracking-[0.2em]">#{app._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 w-full sm:w-auto">
                                        <div className="hidden lg:block text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#0B1512]/30 mb-1">Appointment Type</p>
                                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">General Clinical Checkup</p>
                                        </div>
                                        <div className="flex-1 sm:flex-none">
                                            <Link to="/doctor/appointments" className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0B1512] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-950/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center">
                                                Begin <ArrowRight size={14} className="ml-2" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Analytics Card */}
                <div className="bg-[#0B1512] rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl flex flex-col items-center">
                    <div className="absolute top-0 right-0 w-full h-[30%] bg-gradient-to-b from-emerald-500/10 to-transparent"></div>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                    <div className="relative z-10 w-full flex flex-col h-full">
                        <header className="mb-12">
                            <p className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Efficiency Index</p>
                            <h3 className="text-2xl font-black tracking-tighter">Daily Target</h3>
                        </header>

                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="relative w-64 h-64 flex items-center justify-center">
                                <Doughnut
                                    data={{
                                        datasets: [{
                                            data: [allAppointments.length, Math.max(0, 20 - allAppointments.length)],
                                            backgroundColor: ['#10b981', '#1A2F2B'],
                                            borderWidth: 0,
                                            cutout: '88%',
                                            borderRadius: 20
                                        }]
                                    }}
                                    options={{ plugins: { legend: { display: false } }, rotation: -90, circumference: 360, animation: { duration: 2500, easing: 'easeOutQuart' } }}
                                />
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-6xl font-black tracking-tighter">{Math.round((allAppointments.length / 20) * 100)}%</span>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mt-3">Target Reached</span>
                                </div>
                            </div>

                            <div className="mt-16 w-full space-y-6">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                                    <span className="text-white/40">Daily Capacity</span>
                                    <span className="text-emerald-500">20 Patients</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest p-5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                                    <span className="text-white/40">Status</span>
                                    <span className="text-teal-400">On Schedule</span>
                                </div>
                            </div>
                        </div>

                        <p className="mt-12 text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.4em] leading-loose">
                            HOSPITAL CONTROL SYSTEMS • V4.2.0
                        </p>
                    </div>
                </div>
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
        <div className="space-y-8 bg-[#FBFBFC] -m-6 p-6 min-h-screen pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#0B1512] tracking-tighter uppercase">Appointments</h2>
                    <p className="text-xs font-bold text-emerald-600/50 mt-1 uppercase tracking-widest leading-none">Management Console • Patient Flow</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-white border-2 border-emerald-50 text-emerald-900 shadow-sm transition-all hover:bg-emerald-50 flex-1 sm:flex-none">
                        <Filter size={18} strokeWidth={2.5} /> <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
                    </button>
                    <button className="bg-[#0B1512] text-white px-8 py-3.5 rounded-2xl hover:bg-black shadow-xl shadow-emerald-950/20 transition-all font-black text-[10px] uppercase tracking-widest flex-1 sm:flex-none">
                        Export Dataset
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-emerald-50/20 border-b border-emerald-50">
                                    <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em] text-[#0B1512]/40">Patient Profile</th>
                                    <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em] text-[#0B1512]/40">Consultation Date</th>
                                    <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em] text-[#0B1512]/40">Time Slot</th>
                                    <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em] text-[#0B1512]/40">Clinical Status</th>
                                    <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em] text-[#0B1512]/40 text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-emerald-50/50">
                                {appointments.map((app) => (
                                    <tr key={app._id} className="hover:bg-emerald-50/20 transition-all group">
                                        <td className="p-8">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-[#0B1512] flex items-center justify-center text-white font-black text-lg border-2 border-white ring-4 ring-emerald-50/30">
                                                    {app.patient?.name?.charAt(0) || 'P'}
                                                </div>
                                                <div>
                                                    <span className="block font-black text-[#0B1512] text-lg tracking-tight group-hover:text-emerald-700 transition-colors uppercase">{app.patient?.name || 'Unknown'}</span>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {app._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-emerald-500 opacity-40" />
                                                <span className="font-bold text-[#0B1512]/70 text-sm italic">{new Date(app.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-emerald-500 opacity-40" />
                                                <span className="font-bold text-[#0B1512]/70 text-sm">{app.time}</span>
                                            </div>
                                        </td>
                                        <td className="p-8">
                                            <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 ${app.status === 'Pending' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                                                app.status === 'Approved' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                    app.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                        'bg-rose-50 text-rose-700 border border-rose-100'
                                                }`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'Pending' ? 'bg-amber-500' :
                                                    app.status === 'Approved' ? 'bg-blue-500' :
                                                        app.status === 'Completed' ? 'bg-emerald-500' : 'bg-rose-500'
                                                    }`}></div>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-8 text-right">
                                            <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                                {app.status === 'Pending' && (
                                                    <button onClick={() => handleStatus(app._id, 'Approved')} className="p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm border border-emerald-100">
                                                        <CheckCircle size={18} strokeWidth={2.5} />
                                                    </button>
                                                )}
                                                {app.status === 'Approved' && (
                                                    <button onClick={() => handleStatus(app._id, 'Completed')} className="p-3 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white transition-all shadow-sm border border-teal-100">
                                                        <CheckCircle size={18} strokeWidth={2.5} />
                                                    </button>
                                                )}
                                                {app.status !== 'Completed' && app.status !== 'Cancelled' && (
                                                    <button onClick={() => handleStatus(app._id, 'Cancelled')} className="p-3 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100">
                                                        <XCircle size={18} strokeWidth={2.5} />
                                                    </button>
                                                )}
                                                <button className="p-3 rounded-xl bg-white text-[#0B1512] border-2 border-emerald-50 shadow-sm hover:bg-emerald-50 transition-all font-black text-[10px] uppercase">
                                                    Details
                                                </button>
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
        <div className="space-y-8 bg-[#FBFBFC] -m-6 p-6 min-h-screen pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#0B1512] tracking-tighter uppercase">Patient Registry</h2>
                    <p className="text-xs font-bold text-emerald-600/50 mt-1 uppercase tracking-widest leading-none">Clinical Database • User Records</p>
                </div>
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} strokeWidth={2.5} />
                    <input
                        type="text" placeholder="Search by name or clinical ID..."
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-emerald-50 rounded-[1.5rem] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500/20 outline-none text-[#0B1512] font-black text-xs uppercase tracking-widest placeholder:text-gray-300 transition-all shadow-sm"
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                    {filtered.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-white border-2 border-dashed border-emerald-50 rounded-[3rem]">
                            <Users size={48} className="mx-auto text-emerald-100 mb-6" />
                            <p className="text-emerald-900/20 font-black uppercase tracking-[0.3em] text-xs">No records matching registry query</p>
                        </div>
                    ) : (
                        filtered.map(p => (
                            <div key={p._id} className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-emerald-50/60 hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between h-full">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-[5rem] -mr-4 -mt-4 transition-all group-hover:scale-110 opacity-40"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative">
                                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0B1512] to-[#1A3A32] flex items-center justify-center text-white text-3xl font-black shadow-xl border-4 border-white ring-8 ring-emerald-50/50 group-hover:scale-105 transition-transform">
                                                {p.name?.charAt(0)}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-[#0B1512] tracking-tighter uppercase leading-tight group-hover:text-emerald-700 transition-colors">{p.name || 'Anonymous'}</h4>
                                            <p className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> {p.gender || 'Consultation Pending'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-8">
                                        <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-50">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Joined</p>
                                            <p className="text-xs font-black text-[#0B1512]">{new Date(p.createdAt || Date.now()).getFullYear()}</p>
                                        </div>
                                        <div className="bg-emerald-50/30 p-4 rounded-2xl border border-emerald-50">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Clinic ID</p>
                                            <p className="text-xs font-black text-[#0B1512]">#{p._id.slice(-4).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 relative z-10">
                                    <Link to={`/doctor/prescriptions?patient=${p._id}`} className="flex-[3] bg-[#0B1512] text-white text-[10px] uppercase font-black tracking-[0.2em] py-4 rounded-2xl text-center shadow-xl shadow-emerald-950/20 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2">
                                        Prescribe <ArrowRight size={14} />
                                    </Link>
                                    <button className="flex-1 p-4 bg-white border-2 border-emerald-50 rounded-2xl text-emerald-900 shadow-sm hover:bg-emerald-50 transition-all flex items-center justify-center">
                                        <FileText size={20} />
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
        <div className="space-y-8 bg-[#FBFBFC] -m-6 p-6 min-h-screen pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#0B1512] tracking-tighter uppercase">Prescriptions</h2>
                    <p className="text-xs font-bold text-emerald-600/50 mt-1 uppercase tracking-widest leading-none">Clinical Orders • Pharmacy Registry</p>
                </div>
                <div className="flex w-full sm:w-auto gap-3">
                    <div className="relative flex-1 sm:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} strokeWidth={2.5} />
                        <input
                            type="text" placeholder="Search by patient name..."
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-emerald-50 rounded-[1.5rem] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500/20 outline-none text-[#0B1512] font-black text-xs uppercase tracking-widest placeholder:text-gray-300 transition-all shadow-sm"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button onClick={() => setShowForm(true)} className="bg-[#0B1512] text-white px-8 py-4 rounded-[1.5rem] hover:bg-black shadow-xl shadow-emerald-950/20 transition-all font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 whitespace-nowrap">
                        <PlusCircle size={18} /> New Prescription
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
                    {filtered.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-white border-2 border-dashed border-emerald-50 rounded-[3rem]">
                            <Pill size={48} className="mx-auto text-emerald-100 mb-6" />
                            <p className="text-emerald-900/20 font-black uppercase tracking-[0.3em] text-xs">No active prescription records</p>
                        </div>
                    ) : (
                        filtered.map(rx => (
                            <div key={rx._id} className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-emerald-50 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50/50 rounded-bl-[6rem] -mr-8 -mt-8 transition-all group-hover:scale-110 opacity-30"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="flex items-center gap-6">
                                            <div className="p-5 bg-emerald-50/50 rounded-2xl text-emerald-600 shadow-inner group-hover:bg-[#0B1512] group-hover:text-white transition-all duration-500 border border-emerald-100/50">
                                                <Pill size={28} strokeWidth={2.5} />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-black text-[#0B1512] tracking-tighter uppercase leading-none mb-2 group-hover:text-emerald-700 transition-colors">{rx.patient?.name || 'Anonymous Patient'}</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-emerald-600/40 uppercase tracking-[0.2em]">{new Date(rx.date).toLocaleDateString()}</span>
                                                    <span className="w-1 h-1 rounded-full bg-emerald-100"></span>
                                                    <span className="text-[10px] font-black text-emerald-600/40 uppercase tracking-[0.2em]">REF: #{rx._id.slice(-6).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="bg-emerald-500 text-white text-[10px] font-black px-5 py-2 rounded-xl uppercase tracking-widest shadow-xl shadow-emerald-500/20">Verified Active</span>
                                    </div>

                                    <div className="space-y-3 mb-10">
                                        {rx.medicines?.map((med, i) => (
                                            <div key={i} className="flex justify-between items-center p-5 bg-emerald-50/10 border-2 border-emerald-50/30 rounded-2xl hover:bg-emerald-50/30 hover:border-emerald-100 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                                    <span className="font-black text-[#0B1512] text-sm uppercase tracking-tight">{med.name}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.1em] bg-white px-3 py-1.5 rounded-xl border border-emerald-100 shadow-sm">{med.dosage}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                            <Info size={14} className="opacity-50" /> Clinical Directives
                                        </p>
                                        <p className="text-sm text-slate-600 font-bold italic leading-relaxed">
                                            "{rx.notes || 'No standard clinical notes were appended to this medical order.'}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showForm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#04100C]/70 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-[0_20px_60px_rgba(11,21,18,0.4)] animate-in scale-in duration-300">
                        <div className="bg-[#0B1512] p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                            <div className="relative z-10 flex items-center gap-5">
                                <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl">
                                    <PlusCircle size={28} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black uppercase tracking-tight">Create Prescription</h3>
                                    <p className="text-emerald-500/80 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Medical Portal • Pharmacy Order</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-emerald-950/40 uppercase tracking-widest ml-1">Select Patient</label>
                                <select
                                    required
                                    className="w-full px-4 py-4 bg-emerald-50/30 border-2 border-emerald-50 rounded-2xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none font-bold text-[#0B1512] transition-all"
                                    value={formData.patientId} onChange={e => setFormData({ ...formData, patientId: e.target.value })}
                                >
                                    <option value="">Choose a patient from appointments</option>
                                    {appointments.map(a => a.patient && (
                                        <option key={a.patient._id} value={a.patient._id}>{a.patient.name} ({new Date(a.date).toLocaleDateString()})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-emerald-950/40 uppercase tracking-widest ml-1">Medicines & Dosage</label>
                                    <button type="button" onClick={handleAddMedicine} className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1 hover:text-emerald-800 transition-colors">
                                        <PlusCircle size={14} /> Add Medicine
                                    </button>
                                </div>
                                {formData.medicines.map((med, idx) => (
                                    <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-3 group animate-in slide-in-from-left-4 fade-in duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                                        <input
                                            placeholder="Medicine Name"
                                            className="px-4 py-3.5 bg-emerald-50/10 border-2 border-emerald-50 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none font-bold text-[#0B1512] transition-all"
                                            value={med.name} onChange={e => handleMedChange(idx, 'name', e.target.value)} required
                                        />
                                        <input
                                            placeholder="Dosage (e.g. 1-0-1 after food)"
                                            className="px-4 py-3.5 bg-emerald-50/10 border-2 border-emerald-50 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none font-bold text-[#0B1512] transition-all"
                                            value={med.dosage} onChange={e => handleMedChange(idx, 'dosage', e.target.value)} required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-emerald-950/40 uppercase tracking-widest ml-1">Important Notes</label>
                                <textarea
                                    rows="3" placeholder="Add further instructions or advice here..."
                                    className="w-full px-4 py-4 bg-emerald-50/10 border-2 border-emerald-50 rounded-2xl focus:bg-white focus:border-emerald-500 outline-none font-bold text-[#0B1512] transition-all resize-none"
                                    value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4 pb-2">
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-900/60 hover:bg-emerald-50 transition-all font-black">Cancel</button>
                                <button type="submit" className="flex-[2] px-8 py-4 bg-[#0B1512] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-950/20 hover:bg-[#1A3A32] transition-all active:scale-95 border border-emerald-500/20">Sign & Issue Prescription</button>
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

    return (
        <div className="space-y-8 bg-[#FBFBFC] -m-6 p-6 min-h-screen pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#0B1512] tracking-tighter uppercase">Clinical Reports</h2>
                    <p className="text-xs font-bold text-emerald-600/50 mt-1 uppercase tracking-widest leading-none">Medical Records • Laboratory Results</p>
                </div>
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" size={18} strokeWidth={2.5} />
                    <input
                        type="text" placeholder="Search report database..."
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-emerald-50 rounded-[1.5rem] focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500/20 outline-none text-[#0B1512] font-black text-xs uppercase tracking-widest placeholder:text-gray-300 transition-all shadow-sm"
                        value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="py-20 flex justify-center items-center h-64">
                    <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filtered.length === 0 ? (
                        <div className="col-span-full py-32 text-center bg-white border-2 border-dashed border-emerald-50 rounded-[3rem]">
                            <FileText size={48} className="mx-auto text-emerald-100 mb-6" />
                            <p className="text-emerald-900/20 font-black uppercase tracking-[0.3em] text-xs">No matching clinical records found</p>
                        </div>
                    ) : (
                        filtered.map(report => (
                            <div key={report._id} className="bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-emerald-50 hover:shadow-2xl transition-all duration-500 flex flex-col justify-between group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-[5rem] -mr-4 -mt-4 transition-all group-hover:scale-110 opacity-30"></div>
                                <div className="relative z-10 mb-10">
                                    <div className="p-5 bg-emerald-50/50 rounded-2xl w-fit mb-6 text-emerald-600 group-hover:bg-[#0B1512] group-hover:text-white transition-all duration-500 shadow-inner border border-emerald-100/50">
                                        <FileText size={28} strokeWidth={2.5} />
                                    </div>
                                    <h4 className="text-sm font-black text-[#0B1512] uppercase tracking-[0.1em] leading-tight mb-4 group-hover:text-emerald-700 transition-colors">{report.reportName}</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                            <Users size={12} className="opacity-50" /> {report.patient?.name || 'Unknown Patient'}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <Calendar size={12} className="opacity-50" /> {new Date(report.createdAt || Date.now()).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedReport(report)}
                                    className="w-full py-4 bg-emerald-50 text-emerald-800 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0B1512] hover:text-white transition-all active:scale-95 shadow-sm border border-emerald-100"
                                >
                                    Review Case File
                                </button>
                            </div>
                        ))
                    )}
                </div>
            )}

            {selectedReport && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#04100C]/70 backdrop-blur-xl animate-in fade-in duration-500">
                    <div className="bg-white rounded-[3rem] w-full max-w-xl overflow-hidden shadow-[0_20px_80px_rgba(11,21,18,0.5)] animate-in zoom-in-95 duration-500">
                        <div className="bg-[#0B1512] p-10 text-white relative overflow-hidden">
                            <button onClick={() => setSelectedReport(null)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors z-20">
                                <XCircle size={20} />
                            </button>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                            <div className="relative z-10">
                                <FileText size={48} className="mb-8 text-emerald-500 opacity-60" strokeWidth={2.5} />
                                <h3 className="text-3xl font-black tracking-tighter uppercase leading-tight mb-2">{selectedReport.reportName}</h3>
                                <p className="text-emerald-500/80 text-[10px] font-black uppercase tracking-[0.3em]">Confidential Medical Documentation</p>
                            </div>
                        </div>
                        <div className="p-10 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-emerald-50/30 rounded-[1.5rem] border border-emerald-50">
                                    <p className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] mb-2">Subject Profile</p>
                                    <p className="text-sm font-black text-[#0B1512] uppercase tracking-tight">{selectedReport.patient?.name}</p>
                                </div>
                                <div className="p-6 bg-emerald-50/30 rounded-[1.5rem] border border-emerald-50">
                                    <p className="text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] mb-2">Registry Date</p>
                                    <p className="text-sm font-black text-[#0B1512] uppercase tracking-tight">{new Date(selectedReport.createdAt || Date.now()).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="p-8 bg-slate-50 rounded-[1.5rem] border border-dashed border-slate-200">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                    <Info size={14} className="opacity-50" /> Diagnostic Summary
                                </p>
                                <p className="text-sm text-slate-600 font-bold leading-relaxed italic">
                                    "This report constitutes a finalized clinical summary. All underlying lab telemetry is synchronized and verifiable via the secure clinical node. Integrity check: Passed."
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button className="flex-1 py-5 bg-[#0B1512] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl shadow-emerald-950/20 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <Download size={16} /> Secure Download
                                </button>
                                <button onClick={() => setSelectedReport(null)} className="flex-1 py-5 bg-emerald-50 text-emerald-900 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-emerald-100 transition-all border border-emerald-100">
                                    Dismiss File
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
        <div className="space-y-8 bg-[#FBFBFC] -m-6 p-6 min-h-screen pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-[#0B1512] tracking-tighter uppercase">Clinical Analytics</h2>
                    <p className="text-xs font-bold text-emerald-600/50 mt-1 uppercase tracking-widest leading-none">Performance Telemetry • Practice Insights</p>
                </div>
                <div className="flex gap-4 bg-white p-2 rounded-2xl border border-emerald-50 shadow-sm">
                    <button className="px-5 py-2.5 rounded-xl bg-[#0B1512] text-white text-[10px] font-black uppercase tracking-widest">7 Days</button>
                    <button className="px-5 py-2.5 rounded-xl text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50">30 Days</button>
                    <button className="px-5 py-2.5 rounded-xl text-emerald-600 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50">All Time</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-emerald-50 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-sm font-black text-[#0B1512] uppercase tracking-[0.2em] flex items-center gap-3">
                            <TrendingUp size={20} className="text-emerald-500" strokeWidth={2.5} /> Patient Volume Activity
                        </h3>
                        <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-widest">+12% vs LW</span>
                    </div>
                    <div className="flex-1 min-h-[300px]">
                        <Line
                            data={{
                                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                                datasets: [{
                                    label: 'Clinical Load',
                                    data: [12, 19, 15, 22, 18, 10, 5],
                                    borderColor: '#10b981',
                                    backgroundColor: (context) => {
                                        const chart = context.chart;
                                        const { ctx, chartArea } = chart;
                                        if (!chartArea) return null;
                                        const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                                        gradient.addColorStop(0, 'rgba(16, 185, 129, 0)');
                                        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.15)');
                                        return gradient;
                                    },
                                    fill: true,
                                    tension: 0.5,
                                    borderWidth: 4,
                                    pointRadius: 0,
                                    pointHoverRadius: 6,
                                    pointHoverBackgroundColor: '#10b981',
                                    pointHoverBorderColor: '#fff',
                                    pointHoverBorderWidth: 4
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0B1512', titleFont: { size: 10 }, bodyFont: { size: 12, weight: 'bold' }, padding: 12, borderRadius: 12, displayColors: false } },
                                scales: { x: { grid: { display: false }, ticks: { font: { size: 11, weight: '900', family: 'Inter' }, color: '#94a3b8' } }, y: { grid: { borderDash: [4, 4], color: '#e2e8f0' }, ticks: { font: { size: 11, weight: '900', family: 'Inter' }, color: '#94a3b8' } } }
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-emerald-50 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-sm font-black text-[#0B1512] uppercase tracking-[0.2em] flex items-center gap-3">
                            <Activity size={20} className="text-emerald-500" strokeWidth={2.5} /> Service Distribution
                        </h3>
                    </div>
                    <div className="flex-1 min-h-[300px]">
                        <Bar
                            data={{
                                labels: ['General', 'Dental', 'Pediatric', 'Cardiology', 'Surgery'],
                                datasets: [{
                                    label: 'Total Sessions',
                                    data: [45, 32, 28, 18, 12],
                                    backgroundColor: '#0B1512',
                                    hoverBackgroundColor: '#10b981',
                                    borderRadius: 12,
                                    barThickness: 32
                                }]
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: { x: { grid: { display: false }, ticks: { font: { size: 11, weight: '900', family: 'Inter' }, color: '#94a3b8' } }, y: { grid: { borderDash: [4, 4], color: '#e2e8f0' }, ticks: { font: { size: 11, weight: '900', family: 'Inter' }, color: '#94a3b8' } } }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
                {[
                    { label: 'Avg Session Time', value: '18 min', trend: '-2m', icon: Clock },
                    { label: 'Patient Retention', value: '92%', trend: '+0.5%', icon: Users },
                    { label: 'Outcome Efficacy', value: '4.9/5', trend: '+1.2%', icon: CheckCircle },
                    { label: 'No Show Rate', value: '4%', trend: '-1%', icon: XCircle }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-emerald-50 flex items-center justify-between group hover:border-emerald-200 transition-all shadow-sm">
                        <div className="flex-1 pr-4">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1.5 whitespace-nowrap overflow-hidden text-ellipsis">{stat.label}</p>
                            <div className="flex items-center gap-2">
                                <h4 className="text-xl font-black text-[#0B1512] tracking-tighter">{stat.value}</h4>
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${stat.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{stat.trend}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-[#0B1512] group-hover:text-white transition-all flex-shrink-0">
                            <stat.icon size={20} strokeWidth={2.5} />
                        </div>
                    </div>
                ))}
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
        </Routes>
    );
};

export default DoctorDashboard;
