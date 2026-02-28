import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import {
    Users, UserPlus, Calendar as CalIcon, DollarSign, Activity, FileText, Pill,
    Search, PlusCircle, Trash, Edit, TrendingUp, X, Save
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
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

// --- GENERAL LIST TEMPLATE COMPONENT WITH MODAL ---
const AdminListManager = ({ title, icon: Icon, data, columns, loading, formFields, onSave }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    const handleSave = (e) => {
        e.preventDefault();
        if (onSave) onSave(formData);
        setIsModalOpen(false);
        setFormData({});
    };

    return (
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
                    {formFields && (
                        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-md flex items-center gap-2 whitespace-nowrap">
                            <PlusCircle size={18} /> Add New
                        </button>
                    )}
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-emerald-950/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-emerald-50 flex justify-between items-center bg-emerald-50/30">
                            <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                                <PlusCircle className="text-emerald-500" /> Add New Record
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-emerald-600 hover:bg-emerald-100 p-2 rounded-xl transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            {formFields?.map(f => (
                                <div key={f.name}>
                                    <label className="block text-sm font-bold text-emerald-800 mb-1">{f.label}</label>
                                    {f.type === 'select' ? (
                                        <select className="w-full p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900" onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} required>
                                            <option value="">Select...</option>
                                            {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    ) : f.type === 'textarea' ? (
                                        <textarea className="w-full p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900" rows="3" onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} required></textarea>
                                    ) : (
                                        <input type={f.type || 'text'} className="w-full p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none text-emerald-900" onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} required />
                                    )}
                                </div>
                            ))}
                            <div className="pt-4 flex justify-end gap-3 border-t border-emerald-50 mt-6 bg-white sticky bottom-0">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-emerald-700 font-bold hover:bg-emerald-50 rounded-xl transition-colors">Cancel</button>
                                <button type="submit" className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 shadow-md transition-all active:scale-95"><Save size={18} /> Save Record</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MANAGEMENT SCREENS ---
const DoctorsManagement = () => {
    const [data, setData] = useState([]);
    const [mockAdded, setMockAdded] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/doctors`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (newData) => {
        setMockAdded([...mockAdded, { _id: Math.random().toString(36).substr(2, 6), user: { name: newData.name, email: newData.email }, specialization: newData.specialization, status: 'active' }]);
    };

    const cols = [
        { header: 'ID', render: (r) => <span className="text-gray-500">{r._id.slice(-6).toUpperCase()}</span> },
        { header: 'Doctor Name', render: (r) => <span className="font-bold">{r.user?.name}</span> },
        { header: 'Specialization', key: 'specialization' },
        { header: 'Email Primary', render: (r) => r.user?.email },
        { header: 'Status', render: (r) => <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${r.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{r.status}</span> }
    ];

    const fields = [
        { name: 'name', label: 'Doctor Full Name' },
        { name: 'email', label: 'Email Address', type: 'email' },
        { name: 'specialization', label: 'Specialization' },
        { name: 'fees', label: 'Consultation Fee ($)', type: 'number' }
    ];

    return <AdminListManager title="Doctors Management" icon={UserPlus} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} />;
};

const PatientsManagement = () => {
    const [data, setData] = useState([]);
    const [mockAdded, setMockAdded] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/patients`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (newData) => {
        setMockAdded([...mockAdded, { _id: Math.random().toString(36).substr(2, 6), user: { name: newData.name, phone: newData.phone }, age: newData.age, gender: newData.gender }]);
    };

    const cols = [
        { header: 'Reg ID', render: (r) => <span className="text-gray-500">{r._id.slice(-6).toUpperCase()}</span> },
        { header: 'Patient Name', render: (r) => <span className="font-bold">{r.user?.name}</span> },
        { header: 'Age', key: 'age' },
        { header: 'Gender', render: (r) => <span className="capitalize">{r.gender}</span> },
        { header: 'Contact', render: (r) => r.user?.phone || 'N/A' }
    ];

    const fields = [
        { name: 'name', label: 'Patient Name' },
        { name: 'age', label: 'Age', type: 'number' },
        { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { name: 'phone', label: 'Contact Number' }
    ];

    return <AdminListManager title="Patients Management" icon={Users} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} />;
};

const AppointmentsManagement = () => {
    const [data, setData] = useState([]);
    const [mockAdded, setMockAdded] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/appointments`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (newData) => {
        setMockAdded([...mockAdded, { _id: Math.random().toString(36).substr(2, 6), patient: { user: { name: newData.patientName } }, doctor: { name: newData.doctorName }, date: newData.date, time: newData.time, status: 'Pending' }]);
    };

    const cols = [
        { header: 'Ref', render: (r) => <span className="text-gray-500">{r._id.slice(-6).toUpperCase()}</span> },
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

    const fields = [
        { name: 'patientName', label: 'Find Patient (Name)' },
        { name: 'doctorName', label: 'Assign Doctor' },
        { name: 'date', label: 'Appointment Date', type: 'date' },
        { name: 'time', label: 'Time', type: 'time' }
    ];

    return <AdminListManager title="Appointments Registry" icon={CalIcon} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} />;
};

const DepartmentsManagement = () => {
    const [mockAdded, setMockAdded] = useState([]);

    const data = [
        { id: 'DEP-01', name: 'Cardiology', head: 'Dr. Sarah Connor', staff: 24, status: 'Operational' },
        { id: 'DEP-02', name: 'Neurology', head: 'Dr. John Smith', staff: 18, status: 'Operational' },
        { id: 'DEP-03', name: 'Pediatrics', head: 'Dr. Emily Chen', staff: 15, status: 'Operational' },
    ];

    const handleSave = (newData) => {
        setMockAdded([...mockAdded, { id: `DEP-0${data.length + mockAdded.length + 1}`, name: newData.name, head: newData.head, staff: newData.staff, status: 'Operational' }]);
    };

    const cols = [
        { header: 'Code', key: 'id' },
        { header: 'Department', render: (r) => <span className="font-bold">{r.name}</span> },
        { header: 'Dept. Head', key: 'head' },
        { header: 'Active Staff', key: 'staff' },
        { header: 'Status', render: (r) => <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">{r.status}</span> }
    ];

    const fields = [
        { name: 'name', label: 'Department Name' },
        { name: 'head', label: 'Head of Department' },
        { name: 'staff', label: 'Initial Staff Count', type: 'number' }
    ];

    return <AdminListManager title="Hospital Departments" icon={Activity} data={[...mockAdded, ...data]} columns={cols} loading={false} formFields={fields} onSave={handleSave} />;
};

const BillingManagement = () => {
    const [data, setData] = useState([]);
    const [mockAdded, setMockAdded] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/billing`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (newData) => {
        setMockAdded([...mockAdded, { _id: Math.random().toString(36).substr(2, 6), patient: { name: newData.patientName }, date: new Date(), amount: parseFloat(newData.amount), status: newData.status }]);
    };

    const cols = [
        { header: 'Invoice', render: (r) => <span className="text-gray-500">{r._id.slice(-6).toUpperCase()}</span> },
        { header: 'Patient', render: (r) => r.patient?.name || 'Unknown' },
        { header: 'Issue Date', render: (r) => new Date(r.date).toLocaleDateString() },
        { header: 'Amount', render: (r) => <span className="font-black">${r.amount?.toFixed(2) || '0.00'}</span> },
        { header: 'Status', render: (r) => <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${r.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{r.status}</span> }
    ];

    const fields = [
        { name: 'patientName', label: 'Patient Name' },
        { name: 'description', label: 'Item/Service Description' },
        { name: 'amount', label: 'Amount ($)', type: 'number' },
        { name: 'status', label: 'Payment Status', type: 'select', options: ['Paid', 'Unpaid'] }
    ];

    return <AdminListManager title="Billing & Invoicing" icon={DollarSign} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} />;
};

const PrescriptionsManagement = () => {
    const [data, setData] = useState([]);
    const [mockAdded, setMockAdded] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/prescriptions`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (newData) => {
        setMockAdded([...mockAdded, { _id: Math.random().toString(36).substr(2, 6), patient: { name: newData.patient }, doctor: { name: newData.doctor }, date: new Date(), medicines: new Array(parseInt(newData.items) || 1) }]);
    };

    const cols = [
        { header: 'RX Number', render: (r) => <span className="text-gray-500">{r._id.slice(-6).toUpperCase()}</span> },
        { header: 'Patient', render: (r) => r.patient?.name || 'Unknown' },
        { header: 'Prescribing Doctor', render: (r) => <span className="font-bold">{r.doctor?.name || 'Unknown'}</span> },
        { header: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
        { header: 'Medications', render: (r) => r.medicines ? r.medicines.length : 0 }
    ];

    const fields = [
        { name: 'patient', label: 'Patient Name' },
        { name: 'doctor', label: 'Doctor Issuing' },
        { name: 'items', label: 'Number of Medications', type: 'number' },
        { name: 'notes', label: 'Prescription Notes', type: 'textarea' }
    ];

    return <AdminListManager title="Pharmacy & Prescriptions" icon={Pill} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} />;
};

const ReportsManagement = () => {
    const [data, setData] = useState([]);
    const [mockAdded, setMockAdded] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_BASE}/reports`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (newData) => {
        setMockAdded([...mockAdded, { _id: Math.random().toString(36).substr(2, 6), reportName: newData.reportName, reportType: newData.type, patient: { name: newData.patient }, date: new Date(), fileUrl: 'new_report.pdf' }]);
    };

    const cols = [
        { header: 'Ref ID', render: (r) => <span className="text-gray-500">{r._id.slice(-6).toUpperCase()}</span> },
        { header: 'Report Name', render: (r) => <span className="font-bold">{r.reportName}</span> },
        { header: 'Type', key: 'reportType' },
        { header: 'Patient', render: (r) => r.patient?.name || 'Unknown' },
        { header: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
        { header: 'Attachment', render: (r) => r.fileUrl ? <a href="#" className="flex gap-2 items-center text-blue-600 font-bold hover:underline"><FileText size={16} /> View Data</a> : 'N/A' }
    ];

    const fields = [
        { name: 'reportName', label: 'Report Title' },
        { name: 'type', label: 'Report Type', type: 'select', options: ['Laboratory Test', 'Radiology', 'Pathology'] },
        { name: 'patient', label: 'Associated Patient Name' },
        { name: 'file', label: 'Upload PDF Document', type: 'file' }
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
                <FileText className="text-emerald-500" size={28} /> Reports & Analytics
            </h2>
            <AdminListManager title="Published Medical Reports" icon={FileText} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} />
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
