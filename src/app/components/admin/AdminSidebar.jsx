import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Settings, LogOut, X, Package, Tag } from 'lucide-react';
import logo from '../../../assets/images/logo2.png';

export function AdminSidebar({ isMobile, closeMobileMenu, handleLogout }) {
    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
        { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
        { icon: Package, label: 'My Products', path: '/admin/products' }, // Use Package icon
        { icon: Tag, label: 'Categories', path: '/admin/categories' },
    ];

    const activeStyle = "bg-[#D4AF37] text-black font-bold shadow-lg shadow-[#D4AF37]/20";
    const idleStyle = "text-gray-400 hover:bg-white/5 hover:text-[#D4AF37]";

    return (
        <div className="flex flex-col h-full px-4 py-6">
            <div className="flex items-start justify-between">
                <img
                    src={logo}
                    alt="Naazie's Logo"
                    className={`w-48 h-auto object-contain drop-shadow-lg ${isMobile ? '-mt-8' : '-ml-4 -mt-9'}`}
                    style={{ filter: 'brightness(1.1)' }}
                />
                {isMobile && (
                    <button onClick={closeMobileMenu} className="p-2 text-gray-400 mt-2"><X size={26} /></button>
                )}
            </div>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.label}
                        to={item.path}
                        onClick={() => isMobile && closeMobileMenu()}
                        className={({ isActive }) =>
                            `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive ? activeStyle : idleStyle}`
                        }
                    >
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="pt-6 border-t border-white/5 mt-auto">
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 w-full rounded-xl group cursor-pointer">
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span className="font-semibold">Logout</span>
                </button>
            </div>
        </div>
    );
}