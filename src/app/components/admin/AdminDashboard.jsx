import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [mode, setMode] = useState('overall');
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split('T')[0]
    );

    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingCakes: 0,
        totalRevenue: 0,
        potentialRevenue: 0,
        activeProducts: 0,
        revenueChart: [0, 0, 0, 0, 0, 0, 0]
    });

    const currentPath = location.pathname.split('/').pop();
    const activeTab =
        currentPath === 'admin'
            ? 'Dashboard'
            : currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

    const fetchStats = async () => {
        try {
            // 🔥 Switched to Axios Instance
            const res = await api.get(`/admin/stats?mode=${mode}&date=${selectedDate}`);
            setStats(res.data);
        } catch (err) {
            console.error("Stats error:", err);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [location.pathname, mode, selectedDate]);

    const handleLogout = async () => {
        try {
            // Call the backend to clear the HTTP-only cookie
            await api.post('/admin/logout');
        } catch (err) {
            console.error("Logout error", err);
        } finally {
            // 🔥 ALWAYS clear local storage and redirect, even if API fails
            localStorage.removeItem('adminUser');
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            toast.success("Logged out successfully");
            navigate('/admin/login');
        }
    };

    return (
        <div className="flex min-h-screen bg-[#080808] text-white">
            <aside className="w-72 border-r border-white/5 bg-[#0A0A0A] hidden lg:flex flex-col h-screen sticky top-0">
                <AdminSidebar isMobile={false} handleLogout={handleLogout} />
            </aside>

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed top-0 left-0 h-full w-80 bg-[#0A0A0A] border-r border-white/10 z-50 lg:hidden flex flex-col"
                        >
                            <AdminSidebar
                                isMobile={true}
                                closeMobileMenu={() => setIsMobileMenuOpen(false)}
                                handleLogout={handleLogout}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
                    <AdminHeader
                        activeTab={activeTab}
                        openMobileMenu={() => setIsMobileMenuOpen(true)}
                        mode={mode}
                        setMode={setMode}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                    />
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet context={{ stats, fetchStats }} />
                    </motion.div>
                </div>
            </main>
        </div>
    );
}