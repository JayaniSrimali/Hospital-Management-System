import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
    Users, UserPlus, Calendar as CalIcon, DollarSign, Activity, FileText, Pill,
    Search, PlusCircle, CheckCircle, Clock, Trash, Edit, Filter, TrendingUp
} from 'lucide-react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const API_BASE = 'http://localhost:5000/api';
const getConfig = () => ({
    headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('userInfo'))?.token}` }
});

// --- 1. ADMIN OVERVIEW ---
const DashboardHome = () => {
    const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, revenue: 0 });

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [docRes, patRes, appRes, billRes] = await Promise.all([
                    axios.get(`${API_BASE}/doctors`, getConfig()),
                    axios.get(`${API_BASE}/patients`, getConfig()),
                    axios.get(`${API_BASE}/appointments`, getConfig()),
                    axios.get(`${API_BASE}/billing`, getConfig())
                ]);
                const totalRev = billRes.data
                    .filter(b => b.status === "Paid")
                    .reduce((acc, curr) => acc + curr.amount, 0);

                setStats({
                    doctors: docRes.data.length,
                    patients: patRes.data.length,
                    appointments: appRes.data.length,
                    revenue: totalRev
                });
            } catch (err) {
                console.error("Home stats error", err);
            }
        };
        fetchAll();
    }, []);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Hospital Revenue ($)',
            data: [45000, 52000, 48000, 61000, 59000, 75000 + stats.revenue], // merged mockup with realistic bump
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
        }]
    };

    const statCards = [
        { title: 'Total Patients', value: stats.patients, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'Total Doctors', value: stats.doctors, icon: UserPlus, color: 'text-teal-600', bg: 'bg-teal-50' },
        { title: 'Appointments Logged', value: stats.appointments, icon: CalIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'Total Paid Revenue', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">System Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 flex flex-col hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-xl ${card.bg} ${card.color} flex items-center justify-center mb-4`}>
                            <card.icon size={24} />
                        </div>
                        <p className="text-sm font-bold text-emerald-600/70 uppercase tracking-wider mb-1">{card.title}</p>
                        <h3 className="text-3xl font-black text-emerald-950">{card.value}</h3>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-emerald-100">
                    <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-2">
                        <TrendingUp size={20} className="text-emerald-500" /> Financial Performance
                    </h3>
                    <div className="h-[300px]">
                        <Line data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { borderDash: [4, 4] } } } }} />
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100">
                    <h3 className="text-lg font-bold text-emerald-900 mb-6 flex items-center gap-2">
                        <Activity size={20} className="text-emerald-500" /> Department Load
                    </h3>
                    <div className="h-[250px] flex items-center justify-center">
                        <Doughnut
                            data={{
                                labels: ['Cardiology', 'Neurology', 'Pediatrics', 'General'],
                                datasets: [{ data: [35, 20, 25, 20], backgroundColor: ['#10b981', '#14b8a6', '#3b82f6', '#0ea5e9'], borderWidth: 0 }]
                            }}
                            options={{ maintainAspectRatio: false, cutout: '75%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } } }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- GENERAL LIST TEMPLATE COMPONENT ---
const AdminListManager = ({ title, icon: Icon, data, columns, onAdd, loading }) => (
    <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
            <h2 className="text-2xl font-bold text-emerald-900 flex items-center gap-3">
                <Icon size={28} className="text-emerald-500" /> {title}
            </h2>
            <div className="flex gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400" size={18} />
                    <input type="text" placeholder="Search records..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-emerald-900" />
                </div>
                <button onClick={onAdd} className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-md flex items-center gap-2 whitespace-nowrap">
                    <PlusCircle size={18} /> Add New
                </button>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden min-h-[400px]">
            {loading ? (
                <div className="flex items-center justify-center p-12 text-emerald-500 h-full min-h-[300px]">
                    <Activity size={32} className="animate-spin" />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-emerald-50/50 border-b border-emerald-100">
                                {columns.map((col, i) => (
                                    <th key={i} className="py-4 px-6 text-xs font-black text-emerald-800 uppercase tracking-widest whitespace-nowrap">{col.header}</th>
                                ))}
                                <th className="py-4 px-6 text-xs font-black text-emerald-800 uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-50">
                            {data.map((row, i) => (
                                <tr key={row._id || i} className="hover:bg-emerald-50/30 transition-colors group">
                                    {columns.map((col, j) => (
                                        <td key={j} className="py-4 px-6 text-sm font-medium text-emerald-900 whitespace-nowrap">{col.render ? col.render(row) : row[col.key]}</td>
                                    ))}
                                    <td className="py-4 px-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                                            <button className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {!loading && data.length === 0 && (
                <div className="p-12 text-center text-emerald-500 font-medium">No records found.</div>
            )}
        </div>
    </div>
);

// --- 2. DOCTORS MANAGEMENT ---
const DoctorsManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/doctors`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const cols = [
        { header: 'ID', render: (r) => <span className="text-gray-500">{r._id.slice(-6)}</span> },
        { header: 'Doctor Name', render: (r) => <span className="font-bold">{r.user?.name}</span> },
        { header: 'Specialization', key: 'specialization' },
        { header: 'Email Primary', render: (r) => r.user?.email },
        { header: 'Status', render: (r) => <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${r.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span> }
    ];
    return <AdminListManager title="Doctors Management" icon={UserPlus} data={data} columns={cols} loading={loading} />;
};

// --- 3. PATIENTS MANAGEMENT ---
const PatientsManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/patients`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const cols = [
        { header: 'Reg ID', render: (r) => <span className="text-gray-500">{r._id.slice(-6)}</span> },
        { header: 'Patient Name', render: (r) => <span className="font-bold">{r.user?.name}</span> },
        { header: 'Age', key: 'age' },
        { header: 'Gender', render: (r) => <span className="capitalize">{r.gender}</span> },
        { header: 'Contact', render: (r) => r.user?.phone || 'N/A' }
    ];
    return <AdminListManager title="Patients Management" icon={Users} data={data} columns={cols} loading={loading} />;
};

// --- 4. APPOINTMENTS ---
const AppointmentsManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/appointments`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const cols = [
        { header: 'Ref', render: (r) => <span className="text-gray-500">{r._id.slice(-6)}</span> },
        { header: 'Patient', render: (r) => r.patient?.user?.name || 'Unknown' },
        { header: 'Assigned Doctor', render: (r) => <span className="font-bold">{r.doctor?.name}</span> },
        { header: 'Schedule', render: (r) => new Date(r.date).toLocaleDateString() },
        { header: 'Time', key: 'time' },
        {
            header: 'Status', render: (r) => <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider hover:opacity-80 transition-opacity cursor-pointer
                ${r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                    r.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                        r.status === 'Rejected' ? 'bg-rose-100 text-rose-700' :
                            'bg-amber-100 text-amber-700'}`}>{r.status}</span>
        }
    ];
    return <AdminListManager title="Appointments Registry" icon={CalIcon} data={data} columns={cols} loading={loading} />;
};

// --- 5. DEPARTMENTS ---
const DepartmentsManagement = () => {
    const data = [
        { id: 'DEP-01', name: 'Cardiology', head: 'Dr. Sarah Connor', staff: 24, status: 'Operational' },
        { id: 'DEP-02', name: 'Neurology', head: 'Dr. John Smith', staff: 18, status: 'Operational' },
        { id: 'DEP-03', name: 'Pediatrics', head: 'Dr. Emily Chen', staff: 15, status: 'Operational' },
    ];
    const cols = [
        { header: 'Code', key: 'id' },
        { header: 'Department', render: (r) => <span className="font-bold">{r.name}</span> },
        { header: 'Dept. Head', key: 'head' },
        { header: 'Active Staff', key: 'staff' },
        { header: 'Status', render: (r) => <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">{r.status}</span> }
    ];
    return <AdminListManager title="Hospital Departments" icon={Activity} data={data} columns={cols} loading={false} />;
};

// --- 6. BILLING & PAYMENTS ---
const BillingManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/billing`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const cols = [
        { header: 'Invoice', render: (r) => <span className="text-gray-500">{r._id.slice(-6)}</span> },
        { header: 'Patient', render: (r) => r.patient?.name || 'Unknown' },
        { header: 'Issue Date', render: (r) => new Date(r.date).toLocaleDateString() },
        { header: 'Amount', render: (r) => <span className="font-black">${r.amount.toFixed(2)}</span> },
        { header: 'Status', render: (r) => <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${r.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{r.status}</span> }
    ];
    return <AdminListManager title="Billing & Invoicing" icon={DollarSign} data={data} columns={cols} loading={loading} />;
};

// --- 7. PRESCRIPTIONS ---
const PrescriptionsManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/prescriptions`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const cols = [
        { header: 'RX Number', render: (r) => <span className="text-gray-500">{r._id.slice(-6)}</span> },
        { header: 'Patient', render: (r) => r.patient?.name || 'Unknown' },
        { header: 'Prescribing Doctor', render: (r) => <span className="font-bold">{r.doctor?.name || 'Unknown'}</span> },
        { header: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
        { header: 'Medications', render: (r) => r.medicines ? r.medicines.length : 0 }
    ];
    return <AdminListManager title="Pharmacy & Prescriptions" icon={Pill} data={data} columns={cols} loading={loading} />;
};

// --- 8. REPORTS & ANALYTICS ---
const ReportsManagement = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/reports`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const cols = [
        { header: 'Ref ID', render: (r) => <span className="text-gray-500">{r._id.slice(-6)}</span> },
        { header: 'Report Name', render: (r) => <span className="font-bold">{r.reportName}</span> },
        { header: 'Type', key: 'reportType' },
        { header: 'Patient', render: (r) => r.patient?.name || 'Unknown' },
        { header: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
        { header: 'Attachment', render: (r) => r.fileUrl ? <a href="#" className="flex gap-2 items-center text-blue-600 font-bold hover:underline"><FileText size={16} /> View Data</a> : 'N/A' }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
                <FileText className="text-emerald-500" size={28} /> Reports & Analytics
            </h2>
            <AdminListManager title="Published Medical Reports" icon={FileText} data={data} columns={cols} loading={loading} />
        </div>
    );
};

// --- MAIN ROUTER ---
const AdminDashboard = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/doctors" element={<DoctorsManagement />} />
            <Route path="/patients" element={<PatientsManagement />} />
            <Route path="/appointments" element={<AppointmentsManagement />} />
            <Route path="/departments" element={<DepartmentsManagement />} />
            <Route path="/billing" element={<BillingManagement />} />
            <Route path="/prescriptions" element={<PrescriptionsManagement />} />
            <Route path="/reports" element={<ReportsManagement />} />
        </Routes>
    );
};

export default AdminDashboard;

