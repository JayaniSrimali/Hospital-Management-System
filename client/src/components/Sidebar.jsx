import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, UserPlus, Calendar, Pill, CreditCard, Settings, LogOut, Activity, FileText, User, Bell, X } from 'lucide-react';

const Sidebar = ({ user, onLogout, isOpen, toggleSidebar }) => {
    const adminLinks = [
        { to: '/admin', icon: Home, label: 'Dashboard' },
        { to: '/admin/doctors', icon: UserPlus, label: 'Doctors Management' },
        { to: '/admin/patients', icon: Users, label: 'Patients Management' },
        { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
        { to: '/admin/departments', icon: Activity, label: 'Departments' },
        { to: '/admin/billing', icon: CreditCard, label: 'Billing & Payments' },
        { to: '/admin/prescriptions', icon: Pill, label: 'Prescriptions' },
        { to: '/admin/reports', icon: FileText, label: 'Reports & Analytics' },
    ];

    const doctorLinks = [
        { to: '/doctor', icon: Home, label: 'Dashboard' },
        { to: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
        { to: '/doctor/patients', icon: Users, label: 'Patients' },
        { to: '/doctor/prescriptions', icon: Pill, label: 'Prescriptions' },
        { to: '/doctor/reports', icon: FileText, label: 'Reports' },
        { to: '/doctor/analytics', icon: Activity, label: 'Analytics' },
    ];

    const patientLinks = [
        { to: '/patient', icon: Home, label: 'Dashboard Overview' },
        { to: '/patient/appointments', icon: Calendar, label: 'Appointments' },
        { to: '/patient/doctors', icon: Users, label: 'Doctors' },
        { to: '/patient/prescriptions', icon: Pill, label: 'Prescriptions' },
        { to: '/patient/reports', icon: FileText, label: 'Medical Reports' },
        { to: '/patient/billing', icon: CreditCard, label: 'Billing & Payments' },
    ];

    const links = user?.role === 'admin'
        ? adminLinks
        : user?.role === 'doctor'
            ? doctorLinks
            : patientLinks;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-[#04100C]/60 backdrop-blur-md z-[100] lg:hidden transition-all duration-300"
                    onClick={toggleSidebar}
                ></div>
            )}

            <div className={`fixed inset-y-0 left-0 lg:relative z-[101] flex flex-col w-72 bg-[#0B1512] shadow-[4px_0_32px_rgba(4,47,40,0.4)] rounded-r-[2.5rem] text-white border-r border-[#132A24] overflow-hidden transition-all duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

                {/* Close Button for Mobile */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden absolute top-6 right-6 p-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                >
                    <X size={20} />
                </button>

                {/* Branding Header */}
                <div className="flex flex-col items-center justify-center p-8 border-b border-[#1A3A32]/50 relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-emerald-900/40 to-transparent pointer-events-none"></div>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] mb-4 relative z-10">
                        <Activity size={28} className="text-white drop-shadow-md" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                        MediCare.Sys
                    </h1>
                    <p className="text-emerald-600 font-bold text-[10px] tracking-[0.3em] uppercase mt-1">
                        {user?.role} Portal
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 custom-scrollbar px-4">
                    <nav className="flex flex-col gap-1.5 w-full">
                        <div className="px-4 text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-3 opacity-60">Main Menu</div>
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === '/admin' || link.to === '/doctor' || link.to === '/patient'}
                                onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 font-semibold group ${isActive
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-[0_8px_20px_rgba(16,185,129,0.25)]'
                                        : 'text-emerald-100/60 hover:bg-[#132A24] hover:text-emerald-300'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <link.icon size={20} className={`${isActive ? 'text-white' : 'text-emerald-500 group-hover:scale-110'} transition-transform`} />
                                        <span className="text-sm tracking-wide">{link.label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Logout Section */}
                <div className="p-6 mt-auto bg-gradient-to-t from-[#060D0A] to-transparent border-t border-[#1A3A32]/30">
                    <div className="bg-[#132A24]/60 backdrop-blur-md rounded-2xl p-4 mb-4 flex items-center gap-3 border border-[#1A3A32]/50 shadow-inner">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-inner flex-shrink-0">
                            {user?.name?.charAt(0) || user?.role?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-[10px] text-emerald-500/80 font-bold truncate tracking-wide">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="flex w-full items-center justify-center gap-3 px-6 py-4 rounded-2xl text-rose-300 font-black text-sm uppercase tracking-widest hover:bg-rose-950/40 hover:text-rose-200 border border-transparent hover:border-rose-900/50 transition-all duration-300 active:scale-95"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
