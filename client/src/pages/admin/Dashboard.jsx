import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import {
    Users, UserPlus, Calendar as CalIcon, DollarSign, Activity, FileText, Pill,
    Search, PlusCircle, Trash, Edit, TrendingUp, X, Save,
    Clock, CheckCircle, AlertCircle, ShieldCheck, Bell
} from 'lucide-react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend);

const API_BASE = import.meta.env.PROD
    ? 'https://hospital-management-git-e1f527-jayanisrimali666-2764s-projects.vercel.app/api'
    : 'http://localhost:5000/api';
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
            data: [45000, 52000, 48000, 61000, 59000, 75000 + stats.revenue],
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
const AdminListManager = ({ title, icon: Icon, data, columns, loading, formFields, onSave, onDelete, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [recordToDelete, setRecordToDelete] = useState(null);

    const handleSave = (e) => {
        e.preventDefault();
        if (editingId) {
            if (onUpdate) onUpdate({ ...formData, _id: editingId });
        } else {
            if (onSave) onSave(formData);
        }
        setIsModalOpen(false);
        setFormData({});
        setEditingId(null);
    };

    const confirmDelete = () => {
        if (onDelete && recordToDelete) {
            onDelete(recordToDelete);
        }
        setRecordToDelete(null);
    };

    const filteredData = data.filter(row => {
        const searchStr = searchQuery.toLowerCase();
        return Object.values(row).some(val =>
            val && typeof val !== 'object' && String(val).toLowerCase().includes(searchStr)
        ) || (row.user && Object.values(row.user).some(val =>
            val && typeof val !== 'object' && String(val).toLowerCase().includes(searchStr)
        )) || (row.patient && Object.values(row.patient).some(val =>
            val && typeof val !== 'object' && String(val).toLowerCase().includes(searchStr)
        )) || (row.doctor && Object.values(row.doctor).some(val =>
            val && typeof val !== 'object' && String(val).toLowerCase().includes(searchStr)
        ));
    });

    const handleEditClick = (row) => {
        const initialForm = {
            ...row,
            name: row.name || row.user?.name || '',
            email: row.email || row.user?.email || '',
            phone: row.phone || row.user?.phone || '',
            patientName: row.patientName || row.patient?.name || row.patient?.user?.name || '',
            doctorName: row.doctorName || row.doctor?.name || '',
            patient: row.patient?.name || row.patient || '',
            doctor: row.doctor?.name || row.doctor || '',
            amount: row.amount || '',
            status: row.status || '',
            specialization: row.specialization || '',
            fees: row.fees || '',
            age: row.age || '',
            gender: row.gender || '',
            date: row.date ? new Date(row.date).toISOString().split('T')[0] : '',
            time: row.time || '',
            head: row.head || '',
            staff: row.staff || '',
            description: row.description || '',
            items: row.medicines ? row.medicines.length : (row.items || ''),
            notes: row.notes || '',
            reportName: row.reportName || '',
            type: row.type || row.reportType || ''
        };
        setFormData(initialForm);
        setEditingId(row._id || row.id);
        setIsModalOpen(true);
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
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search records..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-emerald-100 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-medium text-emerald-900" />
                    </div>
                    {formFields && (
                        <button onClick={() => { setEditingId(null); setFormData({}); setIsModalOpen(true); }} className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-md flex items-center gap-2 whitespace-nowrap">
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
                                {filteredData.map((row, i) => (
                                    <tr key={row._id || row.id || i} className="hover:bg-emerald-50/30 transition-colors group">
                                        {columns.map((col, j) => (
                                            <td key={j} className="py-4 px-6 text-sm font-medium text-emerald-900 whitespace-nowrap">{col.render ? col.render(row) : row[col.key]}</td>
                                        ))}
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2 transition-opacity duration-300">
                                                <button onClick={() => handleEditClick(row)} className="p-1.5 text-blue-600 bg-blue-50/50 hover:bg-blue-100 rounded-lg transition-colors shadow-sm"><Edit size={16} /></button>
                                                <button onClick={() => onDelete && setRecordToDelete(row)} className="p-1.5 text-rose-600 bg-rose-50/50 hover:bg-rose-100 rounded-lg transition-colors shadow-sm"><Trash size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {!loading && filteredData.length === 0 && (
                    <div className="p-12 text-center text-emerald-500 font-medium">No records found.</div>
                )}
            </div>

            {recordToDelete && (
                <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="bg-gradient-to-br from-rose-800 to-red-900 p-8 text-white relative flex flex-col items-center text-center">
                            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 backdrop-blur-xl shadow-inner">
                                <Trash size={32} className="text-rose-100" />
                            </div>
                            <h3 className="text-2xl font-black tracking-tight mb-2">Delete Record?</h3>
                            <p className="text-rose-200 font-medium">This action cannot be undone. Are you completely sure you want to remove this data?</p>
                        </div>
                        <div className="p-6 bg-gray-50 flex gap-3">
                            <button onClick={() => setRecordToDelete(null)} className="flex-1 py-3.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors shadow-sm">Cancel</button>
                            <button onClick={confirmDelete} className="flex-1 py-3.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20 active:scale-95">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] animate-in fade-in zoom-in duration-300">
                        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 p-8 text-white relative">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors">✕</button>
                            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-xl">
                                <Icon size={28} />
                            </div>
                            <h3 className="text-2xl font-extrabold tracking-tight">{editingId ? 'Edit Record' : 'Add New Record'}</h3>
                            <p className="text-emerald-300 font-medium mt-1">{editingId ? 'Update details for this entry' : `Create a new entry for ${title.replace(' Management', '')}`}</p>
                        </div>
                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            <div className="space-y-4">
                                {formFields?.map(f => (
                                    <div key={f.name}>
                                        <label className="block text-[10px] font-black text-emerald-800 uppercase tracking-[0.1em] mb-1.5 ml-1">{f.label}</label>
                                        {f.type === 'select' ? (
                                            <select value={formData[f.name] || ''} className="w-full px-4 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-emerald-950" onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} required>
                                                <option value="">Select...</option>
                                                {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        ) : f.type === 'textarea' ? (
                                            <textarea value={formData[f.name] || ''} className="w-full px-4 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-emerald-950" rows="3" onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} required></textarea>
                                        ) : (
                                            <input type={f.type || 'text'} value={formData[f.name] || ''} className="w-full px-4 py-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold text-emerald-950" onChange={e => setFormData({ ...formData, [f.name]: e.target.value })} required />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"><Save size={18} /> {editingId ? 'Update Record' : 'Save Record'}</button>
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
        setMockAdded([{ _id: Math.random().toString(36).substr(2, 6), user: { name: newData.name, email: newData.email }, specialization: newData.specialization, status: 'active' }, ...mockAdded]);
    };

    const handleUpdate = (updatedData) => {
        const updater = item => item._id === updatedData._id ? { ...item, user: { ...item.user, name: updatedData.name, email: updatedData.email }, specialization: updatedData.specialization } : item;
        setData(data.map(updater));
        setMockAdded(mockAdded.map(updater));
    };

    const handleDelete = (row) => {
        setData(data.filter(item => item._id !== row._id));
        setMockAdded(mockAdded.filter(item => item._id !== row._id));
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

    return <AdminListManager title="Doctors Management" icon={UserPlus} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} onDelete={handleDelete} onUpdate={handleUpdate} />;
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
        setMockAdded([{ _id: Math.random().toString(36).substr(2, 6), user: { name: newData.name, phone: newData.phone }, age: newData.age, gender: newData.gender }, ...mockAdded]);
    };

    const handleUpdate = (updatedData) => {
        const updater = item => item._id === updatedData._id ? { ...item, user: { ...item.user, name: updatedData.name, phone: updatedData.phone }, age: updatedData.age, gender: updatedData.gender } : item;
        setData(data.map(updater));
        setMockAdded(mockAdded.map(updater));
    };

    const handleDelete = (row) => {
        setData(data.filter(item => item._id !== row._id));
        setMockAdded(mockAdded.filter(item => item._id !== row._id));
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

    return <AdminListManager title="Patients Management" icon={Users} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} onDelete={handleDelete} onUpdate={handleUpdate} />;
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
        setMockAdded([{ _id: Math.random().toString(36).substr(2, 6), patient: { user: { name: newData.patientName } }, doctor: { name: newData.doctorName }, date: newData.date, time: newData.time, status: 'Pending' }, ...mockAdded]);
    };

    const handleUpdate = (updatedData) => {
        const updater = item => item._id === updatedData._id ? { ...item, patient: { ...item.patient, user: { ...item.patient?.user, name: updatedData.patientName } }, doctor: { ...item.doctor, name: updatedData.doctorName }, date: updatedData.date, time: updatedData.time } : item;
        setData(data.map(updater));
        setMockAdded(mockAdded.map(updater));
    };

    const handleDelete = (row) => {
        setData(data.filter(item => item._id !== row._id));
        setMockAdded(mockAdded.filter(item => item._id !== row._id));
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

    return <AdminListManager title="Appointments Registry" icon={CalIcon} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} onDelete={handleDelete} onUpdate={handleUpdate} />;
};

const DepartmentsManagement = () => {
    const [mockAdded, setMockAdded] = useState([]);

    const [data, setData] = useState([
        { id: 'DEP-01', name: 'Cardiology', head: 'Dr. Sarah Connor', staff: 24, status: 'Operational' },
        { id: 'DEP-02', name: 'Neurology', head: 'Dr. John Smith', staff: 18, status: 'Operational' },
        { id: 'DEP-03', name: 'Pediatrics', head: 'Dr. Emily Chen', staff: 15, status: 'Operational' },
    ]);

    const handleSave = (newData) => {
        setMockAdded([{ id: `DEP-0${data.length + mockAdded.length + 1}`, name: newData.name, head: newData.head, staff: newData.staff, status: 'Operational' }, ...mockAdded]);
    };

    const handleUpdate = (updatedData) => {
        const updater = item => item.id === updatedData._id ? { ...item, name: updatedData.name, head: updatedData.head, staff: updatedData.staff } : item;
        setData(data.map(updater));
        setMockAdded(mockAdded.map(updater));
    };

    const handleDelete = (row) => {
        setData(data.filter(item => item.id !== row.id));
        setMockAdded(mockAdded.filter(item => item.id !== row.id));
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

    return <AdminListManager title="Hospital Departments" icon={Activity} data={[...mockAdded, ...data]} columns={cols} loading={false} formFields={fields} onSave={handleSave} onDelete={handleDelete} onUpdate={handleUpdate} />;
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
        setMockAdded([{ _id: Math.random().toString(36).substr(2, 6), patient: { name: newData.patientName }, date: new Date(), amount: parseFloat(newData.amount), status: newData.status }, ...mockAdded]);
    };

    const handleUpdate = (updatedData) => {
        const updater = item => item._id === updatedData._id ? { ...item, patient: { ...item.patient, name: updatedData.patientName }, amount: parseFloat(updatedData.amount) || item.amount, status: updatedData.status || item.status } : item;
        setData(data.map(updater));
        setMockAdded(mockAdded.map(updater));
    };

    const handleDelete = (row) => {
        setData(data.filter(item => item._id !== row._id));
        setMockAdded(mockAdded.filter(item => item._id !== row._id));
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

    return <AdminListManager title="Billing & Invoicing" icon={DollarSign} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} onDelete={handleDelete} onUpdate={handleUpdate} />;
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
        setMockAdded([{ _id: Math.random().toString(36).substr(2, 6), patient: { name: newData.patient }, doctor: { name: newData.doctor }, date: new Date(), medicines: new Array(parseInt(newData.items) || 1) }, ...mockAdded]);
    };

    const handleUpdate = (updatedData) => {
        const updater = item => item._id === updatedData._id ? { ...item, patient: { ...item.patient, name: updatedData.patient }, doctor: { ...item.doctor, name: updatedData.doctor }, medicines: updatedData.items ? new Array(parseInt(updatedData.items)) : item.medicines } : item;
        setData(data.map(updater));
        setMockAdded(mockAdded.map(updater));
    };

    const handleDelete = (row) => {
        setData(data.filter(item => item._id !== row._id));
        setMockAdded(mockAdded.filter(item => item._id !== row._id));
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

    return <AdminListManager title="Pharmacy & Prescriptions" icon={Pill} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} onDelete={handleDelete} onUpdate={handleUpdate} />;
};

const ReportsManagement = () => {
    const [data, setData] = useState([]);
    const [mockAdded, setMockAdded] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        axios.get(`${API_BASE}/reports`, getConfig())
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleSave = (newData) => {
        setMockAdded([{ _id: Math.random().toString(36).substr(2, 6), reportName: newData.reportName, reportType: newData.type, patient: { name: newData.patient }, date: new Date(), fileUrl: 'new_report.pdf' }, ...mockAdded]);
    };

    const handleUpdate = (updatedData) => {
        const updater = item => item._id === updatedData._id ? { ...item, reportName: updatedData.reportName, reportType: updatedData.type, patient: { ...item.patient, name: updatedData.patient } } : item;
        setData(data.map(updater));
        setMockAdded(mockAdded.map(updater));
    };

    const handleDelete = (row) => {
        setData(data.filter(item => item._id !== row._id));
        setMockAdded(mockAdded.filter(item => item._id !== row._id));
    };

    const cols = [
        { header: 'Ref ID', render: (r) => <span className="text-gray-500">{r._id.slice(-6).toUpperCase()}</span> },
        { header: 'Report Name', render: (r) => <span className="font-bold">{r.reportName}</span> },
        { header: 'Type', key: 'reportType' },
        { header: 'Patient', render: (r) => r.patient?.name || 'Unknown' },
        { header: 'Date', render: (r) => new Date(r.date).toLocaleDateString() },
        { header: 'Attachment', render: (r) => r.fileUrl ? <button onClick={() => setSelectedReport(r)} className="flex gap-2 items-center text-blue-600 font-bold hover:underline"><FileText size={16} /> View Data</button> : 'N/A' }
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
            <AdminListManager title="Published Medical Reports" icon={FileText} data={[...mockAdded, ...data]} columns={cols} loading={loading} formFields={fields} onSave={handleSave} onDelete={handleDelete} onUpdate={handleUpdate} />

            {selectedReport && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="bg-gradient-to-br from-emerald-800 to-teal-900 p-6 text-white relative flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/20 w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-xl">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{selectedReport.reportName || 'Medical Document'}</h3>
                                    <p className="text-emerald-200 text-sm font-medium">{selectedReport.patient?.name || 'Unknown Patient'} • {new Date(selectedReport.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedReport(null)} className="text-white/60 hover:text-white transition-colors bg-white/10 p-2 rounded-xl">✕</button>
                        </div>
                        <div className="p-8 bg-gray-50 flex items-center justify-center h-[60vh]">
                            <div className="text-center space-y-4 max-w-sm">
                                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                                    <FileText size={40} />
                                </div>
                                <h4 className="text-lg font-bold text-emerald-950">PDF Report Viewer</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    The document <span className="font-bold text-emerald-700">{selectedReport.fileUrl || 'report.pdf'}</span> would be seamlessly rendered here using a PDF viewing library.
                                </p>
                                <button onClick={() => window.open('#', '_blank')} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-colors inline-block mt-4">
                                    Download Original PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 10. NOTIFICATIONS ---
const AdminNotifications = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-emerald-900">Notifications</h2>
            <button className="text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm border border-emerald-100">Mark all as read</button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
            <div className="flex flex-col">
                <div className="p-6 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors flex gap-4 items-start relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0 mt-1 shadow-sm"><Users size={24} /></div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-emerald-900 text-lg">New Doctor Registration</h4>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">1 hour ago</span>
                        </div>
                        <p className="text-emerald-700 font-medium">Dr. Alice Williams has registered and is pending approval.</p>
                        <div className="mt-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-sm font-bold text-blue-700 bg-blue-100 px-4 py-1.5 rounded-lg hover:bg-blue-200 transition-colors">Review Application</button>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors flex gap-4 items-start relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>
                    <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 shrink-0 mt-1 shadow-sm"><CheckCircle size={24} /></div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-emerald-900 text-lg">System Update Complete</h4>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">Yesterday</span>
                        </div>
                        <p className="text-emerald-700 font-medium">The hospital management system components were successfully updated to v1.2.0.</p>
                    </div>
                </div>

                <div className="p-6 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors flex gap-4 items-start relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                    <div className="bg-rose-100 p-3 rounded-full text-rose-600 shrink-0 mt-1 shadow-sm"><AlertCircle size={24} /></div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-emerald-900 text-lg">High CPU Usage</h4>
                            <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">2 days ago</span>
                        </div>
                        <p className="text-emerald-700 font-medium">The database server experienced a spike in CPU usage. Please monitor performance.</p>
                        <div className="mt-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-sm font-bold text-rose-700 bg-rose-100 px-4 py-1.5 rounded-lg hover:bg-rose-200 transition-colors">View System Logs</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// --- 11. ADMIN PROFILE ---
const AdminProfile = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Admin User',
        email: user?.email || 'admin@medicare.com',
        phone: '+1 (555) 123-4567',
        role: 'System Administrator',
        address: '123 Emerald Avenue, Suite 1A, New York, NY 10001',
        emergencyContact: 'John Doe - +1 (555) 987-6543'
    });

    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            // Simulated save wait time
            await new Promise(r => setTimeout(r, 1000));
            // Actual save when profile endpoint is built
            // await axios.put(`http://localhost:5000/api/auth/profile`, profileData, { headers: { Authorization: `Bearer ${token}` } });
            setIsEditing(false);
            setToast({ message: 'Profile updated successfully!', type: 'success' });
            setTimeout(() => setToast(null), 3000);
        } catch (err) {
            console.error(err);
            setToast({ message: 'Failed to update profile. Please try again.', type: 'error' });
            setTimeout(() => setToast(null), 3000);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">Admin Profile</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 text-center md:col-span-1 border-t-4 border-t-emerald-500">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-5xl shadow-inner mb-4">
                        {profileData.name.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-extrabold text-emerald-900">{profileData.name}</h3>
                    <p className="text-emerald-600 font-medium mb-4">{profileData.email}</p>
                    <div className="inline-flex py-1 px-4 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700 capitalize border border-emerald-200">
                        {user?.role || 'Admin'} Account
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
                            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Role</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    className="w-full p-3 bg-white rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none text-emerald-900 font-semibold shadow-sm transition-all"
                                    value={profileData.role}
                                    onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                                />
                            ) : (
                                <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 text-emerald-900 font-medium">{profileData.role}</div>
                            )}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Admin Address</label>
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
                                disabled={saving}
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
                            >
                                {saving ? "Saving..." : <><CheckCircle size={18} /> Update Profile</>}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-lg border text-white font-bold flex items-center gap-2 ${toast.type === 'success' ? 'bg-emerald-600 border-emerald-700' : 'bg-rose-600 border-rose-700'}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

// --- 12. ADMIN SETTINGS ---
const AdminSettings = () => {
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [toast, setToast] = useState(null);
    const [saving, setSaving] = useState(false);

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setToast({ message: "New passwords do not match!", type: 'error' });
            setTimeout(() => setToast(null), 3000);
            return;
        }

        setSaving(true);
        try {
            const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
            await axios.put(`http://localhost:5000/api/auth/profile`, { password: passwords.new }, { headers: { Authorization: `Bearer ${token}` } });
            setPasswords({ current: '', new: '', confirm: '' });
            setToast({ message: 'Password updated successfully!', type: 'success' });
            setTimeout(() => setToast(null), 3000);
        } catch (err) {
            console.error(err);
            setToast({ message: 'Failed to update password. Please try again.', type: 'error' });
            setTimeout(() => setToast(null), 3000);
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
                    <p className="text-emerald-600 text-sm mb-6 font-medium">Ensure your Admin account is using a strong password for maximum security.</p>

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
                    <p className="text-emerald-600 text-sm mb-6 font-medium">Control what system-level alerts you receive and how you receive them.</p>

                    <div className="space-y-4 max-w-lg">
                        <label className="flex items-center justify-between p-4 border border-emerald-100 rounded-xl hover:bg-emerald-50/50 cursor-pointer transition-colors">
                            <div>
                                <span className="font-bold text-emerald-900 block">New User Registrations</span>
                                <span className="text-xs text-emerald-600 font-medium">Get notified when new doctors or patients join.</span>
                            </div>
                            <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                        </label>
                        <label className="flex items-center justify-between p-4 border border-emerald-100 rounded-xl hover:bg-emerald-50/50 cursor-pointer transition-colors">
                            <div>
                                <span className="font-bold text-emerald-900 block">System Anomalies</span>
                                <span className="text-xs text-emerald-600 font-medium">Alert me on critical system errors or downtime.</span>
                            </div>
                            <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                        </label>
                        <label className="flex items-center justify-between p-4 border border-emerald-100 rounded-xl hover:bg-emerald-50/50 cursor-pointer transition-colors">
                            <div>
                                <span className="font-bold text-emerald-900 block">Database Backup</span>
                                <span className="text-xs text-emerald-600 font-medium">Receive confirmation for weekly database backups.</span>
                            </div>
                            <input type="checkbox" defaultChecked className="w-5 h-5 accent-emerald-600 cursor-pointer" />
                        </label>
                    </div>
                </div>

                <div className="p-8 bg-rose-50/30">
                    <h3 className="text-xl font-extrabold text-rose-700 mb-2">Danger Zone</h3>
                    <p className="text-rose-600/80 text-sm mb-5 font-medium">Permanently deleting this Admin account requires Super Admin privileges.</p>
                    <button className="bg-white border-2 border-rose-200 text-rose-700 hover:bg-rose-600 hover:text-white hover:border-rose-600 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm">
                        Delete Account Permanently
                    </button>
                </div>
                {toast && (
                    <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl shadow-lg border text-white font-bold flex items-center gap-2 ${toast.type === 'success' ? 'bg-emerald-600 border-emerald-700' : 'bg-rose-600 border-rose-700'}`}>
                        {toast.message}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- MAIN ROUTER ---
const AdminDashboard = ({ user }) => {
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
            <Route path="/notifications" element={<AdminNotifications />} />
            <Route path="/profile" element={<AdminProfile user={user} />} />
            <Route path="/settings" element={<AdminSettings />} />
        </Routes>
    );
};

export default AdminDashboard;
