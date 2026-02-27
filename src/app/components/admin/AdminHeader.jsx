import React, { useRef } from 'react';
import { Menu, CalendarDays } from 'lucide-react';

export function AdminHeader({
    activeTab,
    openMobileMenu,
    mode,
    setMode,
    selectedDate,
    setSelectedDate
}) {
    const dateInputRef = useRef(null);

    // 🔥 Logic: Only show controls if we are on the 'Dashboard' or 'Overview' tab
    const isDashboard = activeTab === 'Dashboard' || activeTab === 'Overview';

    return (
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

            {/* LEFT SECTION */}
            <div className="flex items-center gap-4">
                <button
                    onClick={openMobileMenu}
                    className="p-2 bg-white/5 rounded-lg md:hidden text-[#D4AF37] cursor-pointer"
                >
                    <Menu size={24} />
                </button>

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        {activeTab} Overview
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm md:text-base">
                        Welcome back, <span className="text-[#D4AF37] font-semibold">Naazie</span>
                    </p>
                </div>
            </div>

            {/* RIGHT SECTION — ONLY RENDERED ON DASHBOARD */}
            {isDashboard && (
                <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto">

                    {/* TOGGLE */}
                    <div className="flex bg-[#1A1A1A] border border-white/10 rounded-2xl p-1">
                        <button
                            type="button"
                            onClick={() => setMode('overall')}
                            className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer
                                ${mode === 'overall'
                                    ? 'bg-white text-black shadow'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            OVERALL
                        </button>

                        <button
                            type="button"
                            onClick={() => setMode('daily')}
                            className={`px-4 md:px-6 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer
                                ${mode === 'daily'
                                    ? 'bg-white text-black shadow'
                                    : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            DAILY
                        </button>
                    </div>

                    {/* DATE PICKER — ONLY WHEN DAILY */}
                    {mode === 'daily' && (
                        <div className="flex items-center gap-3 border-l border-white/10 pl-4 md:pl-6">
                            <label className="relative flex items-center gap-3 cursor-pointer group p-2 bg-white/5 rounded-xl hover:bg-white/10 transition">
                                <CalendarDays size={20} className="text-orange-500 group-hover:scale-110 transition" />
                                <span className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
                                    {new Date(selectedDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    })}
                                </span>
                                <input
                                    ref={dateInputRef}
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                                />
                            </label>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}