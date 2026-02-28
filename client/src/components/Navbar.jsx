import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, UserCircle, Settings, LogOut, CheckCircle, AlertCircle, Clock, ChevronDown, Menu } from 'lucide-react';

const Navbar = ({ user, onLogout, toggleSidebar }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const navigate = useNavigate();

    // Ref for closing dropdowns when clicking outside
    const navRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setShowNotifications(false);
                setShowProfile(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <header ref={navRef} className="bg-white/80 backdrop-blur-md shadow-sm h-20 w-full flex items-center justify-between px-4 md:px-8 z-[90] sticky top-0 border-b border-emerald-100/50 transition-all">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden p-2 rounded-xl text-emerald-900 hover:bg-emerald-50 transition-colors"
                >
                    <Menu size={24} />
                </button>
                <div className="text-lg md:text-xl font-bold text-emerald-900 tracking-tight flex items-center gap-2">
                    <span className="hidden sm:inline">Welcome back,</span> <span className="text-emerald-600 truncate max-w-[120px] md:max-w-none">{user.name}</span>
                </div>
            </div>

            <div className="flex items-center gap-5">
                {/* Notifications Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowNotifications(!showNotifications);
                            setShowProfile(false);
                        }}
                        className={`relative p-2.5 rounded-xl transition-all duration-300 ${showNotifications ? 'bg-emerald-100 text-emerald-700' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                    >
                        <Bell size={22} className={showNotifications ? 'fill-emerald-200' : ''} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full animate-pulse"></span>
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_10px_40px_rgba(4,47,40,0.1)] border border-emerald-100/50 overflow-hidden slide-down">
                            <div className="p-4 border-b border-emerald-50 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-bold text-emerald-900">Notifications</h3>
                                <button className="text-xs font-bold text-emerald-600 hover:text-emerald-800">Mark all read</button>
                            </div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                <div className="p-4 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors cursor-pointer flex gap-3 items-start">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0"><Clock size={16} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-900">Upcoming Appointment</p>
                                        <p className="text-xs text-emerald-600 mt-1">Dr. Smith • Tomorrow, 10:00 AM</p>
                                    </div>
                                </div>
                                <div className="p-4 border-b border-emerald-50 hover:bg-emerald-50/30 transition-colors cursor-pointer flex gap-3 items-start">
                                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 shrink-0"><CheckCircle size={16} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-900">Lab Results Ready</p>
                                        <p className="text-xs text-emerald-600 mt-1">Your blood test results are now available.</p>
                                    </div>
                                </div>
                                <div className="p-4 hover:bg-emerald-50/30 transition-colors cursor-pointer flex gap-3 items-start">
                                    <div className="bg-rose-100 p-2 rounded-full text-rose-600 shrink-0"><AlertCircle size={16} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-900">Payment Overdue</p>
                                        <p className="text-xs text-rose-600 mt-1">Please settle your invoice for last visit.</p>
                                    </div>
                                </div>
                            </div>
                            <div
                                onClick={() => { setShowNotifications(false); navigate(`/${user.role}/notifications`); }}
                                className="p-3 border-t border-emerald-50 text-center bg-gray-50/50 hover:bg-emerald-50 cursor-pointer transition-colors"
                            >
                                <span className="text-xs font-bold text-emerald-700">View All Notifications</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="h-8 w-px bg-emerald-100 hidden sm:block"></div>

                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => {
                            setShowProfile(!showProfile);
                            setShowNotifications(false);
                        }}
                        className={`flex items-center gap-3 px-3 py-2 rounded-2xl border transition-all duration-300 ${showProfile ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'border-transparent hover:bg-gray-50 hover:border-emerald-100'}`}
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold shadow-inner">
                            {user?.name?.charAt(0) || user?.role?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex flex-col text-left hidden sm:flex">
                            <span className="text-sm font-bold text-emerald-950 leading-tight">{user.name}</span>
                            <span className="text-xs text-emerald-600 font-bold capitalize bg-emerald-100/50 rounded inline-block mt-0.5 px-1 py-0.5 w-fit">
                                {user.role}
                            </span>
                        </div>
                        <ChevronDown size={16} className={`text-emerald-600 transition-transform duration-300 hidden sm:block ${showProfile ? 'rotate-180' : ''}`} />
                    </button>

                    {showProfile && (
                        <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-[0_10px_40px_rgba(4,47,40,0.1)] border border-emerald-100/50 overflow-hidden slide-down">
                            <div className="p-5 border-b border-emerald-50 bg-gradient-to-br from-emerald-50 to-white">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xl shadow-inner">
                                        {user?.name?.charAt(0) || user?.role?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-emerald-950">{user.name}</p>
                                        <p className="text-xs text-emerald-600 font-medium truncate max-w-[130px]">{user.email || 'user@medicare.com'}</p>
                                    </div>
                                </div>
                                <span className="inline-flex py-1 px-3 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 capitalize border border-emerald-200">
                                    {user.role} Account
                                </span>
                            </div>
                            <div className="p-2">
                                <button
                                    onClick={() => { setShowProfile(false); navigate(`/${user.role}/profile`); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl transition-colors"
                                >
                                    <UserCircle size={18} className="text-emerald-500" />
                                    My Profile
                                </button>
                                <button
                                    onClick={() => { setShowProfile(false); navigate(`/${user.role}/settings`); }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-emerald-800 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl transition-colors"
                                >
                                    <Settings size={18} className="text-emerald-500" />
                                    Account Settings
                                </button>
                                <div className="h-px bg-emerald-50 my-2 mx-2"></div>
                                <button
                                    onClick={() => {
                                        if (onLogout) onLogout();
                                        else {
                                            localStorage.removeItem('userInfo');
                                            window.location.href = '/login';
                                        }
                                    }}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;
