import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import { Users, UserPlus, Calendar as CalIcon, DollarSign } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardHome = () => {
    const [stats, setStats] = useState({ doctors: 0, patients: 0, appointments: 0, revenue: 0 });

    useEffect(() => {
        // In a real app we'd fetch this from API
        // Mocking for now to show UI
        setStats({
            doctors: 12,
            patients: 154,
            appointments: 45,
            revenue: 12500
        });
    }, []);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Appointments',
                data: [65, 59, 80, 81, 56, 45],
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
            },
        ],
    };

    const statCards = [
        { title: 'Total Patients', value: stats.patients, icon: Users, color: 'bg-blue-500' },
        { title: 'Total Doctors', value: stats.doctors, icon: UserPlus, color: 'bg-green-500' },
        { title: 'Appointments', value: stats.appointments, icon: CalIcon, color: 'bg-yellow-500' },
        { title: 'Revenue', value: `$${stats.revenue}`, icon: DollarSign, color: 'bg-purple-500' },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.title}</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-2">{card.value}</h3>
                        </div>
                        <div className={`p-4 rounded-full ${card.color} text-white`}>
                            <card.icon size={24} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Activity Overview</h3>
                <div className="h-80">
                    <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    return (
        <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/doctors" element={<div className="p-6 bg-white rounded-xl shadow-sm">Doctors Management (Coming Soon)</div>} />
            <Route path="/patients" element={<div className="p-6 bg-white rounded-xl shadow-sm">Patients Management (Coming Soon)</div>} />
            <Route path="/appointments" element={<div className="p-6 bg-white rounded-xl shadow-sm">Appointments Overview (Coming Soon)</div>} />
            <Route path="/billing" element={<div className="p-6 bg-white rounded-xl shadow-sm">Billing & Revenue (Coming Soon)</div>} />
        </Routes>
    );
};

export default AdminDashboard;
