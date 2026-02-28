import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, UserPlus, Calendar, Pill, CreditCard, Settings, LogOut, Activity } from 'lucide-react';

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
        <div className="flex flex-col w-72 bg-[#0B1512] shadow-[4px_0_24px_rgba(4,47,40,0.15)] rounded-r-[2rem] text-white border-r border-[#132A24] overflow-hidden relative">
            {/* Branding Header */}
            <div className="flex flex-col items-center justify-center p-8 border-b border-[#1A3A32]/50 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-900/40 to-transparent pointer-events-none"></div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4 relative z-10">
                    <Activity size={28} className="text-white drop-shadow-md" />
                </div>
                <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                    MediCare.Sys
                </h1>
                <p className="text-emerald-600 font-bold text-xs tracking-[0.2em] uppercase mt-1">
                    {user?.role} Portal
                </p>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                <nav className="flex flex-col gap-1.5 px-4 w-full">
                    <div className="px-4 text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Main Menu</div>
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === '/admin' || link.to === '/doctor' || link.to === '/patient'}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300 font-medium ${isActive
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-900/50'
                                    : 'text-emerald-100/70 hover:bg-[#132A24] hover:text-emerald-300'
                                }`
                            }
                        >
                            <link.icon size={20} className={({ isActive }) => isActive ? 'text-white' : 'text-emerald-500/80'} />
                            <span className="text-sm tracking-wide">{link.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Logout Section */}
            <div className="p-6 mt-auto bg-gradient-to-t from-[#060D0A] to-transparent border-t border-[#1A3A32]/30">
                <div className="bg-[#132A24] rounded-2xl p-4 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-inner">
                        {user?.name?.charAt(0) || user?.role?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-emerald-500 truncate">{user?.email}</p>
                    </div>
                </div>

                <button
                    onClick={onLogout}
                    className="flex w-full items-center justify-center gap-3 px-6 py-3.5 rounded-xl text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 border border-transparent hover:border-rose-900/50 transition-all duration-300 font-bold tracking-wide active:scale-[0.98]"
                >
                    <LogOut size={18} />
                    <span>Secure Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
