import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, UserPlus, Calendar, Pill, CreditCard, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ user, onLogout }) => {
    const adminLinks = [
        { to: '/admin', icon: Home, label: 'Dashboard' },
        { to: '/admin/doctors', icon: UserPlus, label: 'Doctors' },
        { to: '/admin/patients', icon: Users, label: 'Patients' },
        { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
        { to: '/admin/billing', icon: CreditCard, label: 'Billing' },
    ];

    const doctorLinks = [
        { to: '/doctor', icon: Home, label: 'Dashboard' },
        { to: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
        { to: '/doctor/prescriptions', icon: Pill, label: 'Prescriptions' },
    ];

    const patientLinks = [
        { to: '/patient', icon: Home, label: 'Dashboard' },
        { to: '/patient/appointments', icon: Calendar, label: 'My Appointments' },
        { to: '/patient/prescriptions', icon: Pill, label: 'My Prescriptions' },
        { to: '/patient/billing', icon: CreditCard, label: 'My Bills' },
    ];

    const links = user?.role === 'admin'
        ? adminLinks
        : user?.role === 'doctor'
            ? doctorLinks
            : patientLinks;

    return (
        <div className="flex flex-col w-64 bg-indigo-800 shadow-xl rounded-r-2xl text-white">
            <div className="flex items-center justify-center h-20 border-b border-indigo-700">
                <h1 className="text-2xl font-bold tracking-wider">MediCare HMS</h1>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="flex flex-col gap-2 px-4">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${isActive
                                    ? 'bg-indigo-600 shadow-md transform scale-105'
                                    : 'hover:bg-indigo-700 hover:translate-x-1'
                                }`
                            }
                        >
                            <link.icon size={20} />
                            <span className="font-medium">{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div className="p-4 border-t border-indigo-700">
                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-indigo-200 hover:bg-indigo-700 hover:text-white transition-all duration-300"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
