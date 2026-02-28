import React from 'react';
import { Bell, UserCircle } from 'lucide-react';

const Navbar = ({ user }) => {
    if (!user) return null;

    return (
        <header className="bg-white shadow-sm h-16 w-full flex items-center justify-between px-6 z-10 sticky top-0 border-b border-gray-100">
            <div className="text-xl font-semibold text-gray-800 capitalize">
                Welcome back, {user.name}
            </div>
            <div className="flex items-center gap-6">
                <button className="relative text-gray-500 hover:text-indigo-600 transition-colors">
                    <Bell size={24} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                    <UserCircle size={28} className="text-indigo-600" />
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-700 leading-none">{user.name}</span>
                        <span className="text-xs text-indigo-500 font-medium capitalize mt-1 border border-indigo-200 bg-indigo-50 rounded-md px-1 py-0.5 inline-block w-fit text-center leading-none">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
