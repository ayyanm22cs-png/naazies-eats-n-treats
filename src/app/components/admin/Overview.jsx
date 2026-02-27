import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { TrendingUp, ShoppingBag, Package, DollarSign, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts"; //

export function Overview() {
    const context = useOutletContext(); //
    const navigate = useNavigate(); //

    const stats = context?.stats || {
        totalOrders: 0,
        pendingCakes: 0,
        totalRevenue: 0,
        potentialRevenue: 0,
        activeProducts: 0,
        trajectoryChart: []
    };

    const cards = [
        { title: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: <DollarSign className="text-emerald-500" />, trend: `₹${stats.potentialRevenue} in pipeline`, color: 'border-emerald-500/20' },
        { title: 'Active Orders', value: stats.totalOrders, icon: <ShoppingBag className="text-orange-500" />, trend: 'Live updates', color: 'border-orange-500/20' },
        { title: 'Pending Cakes', value: stats.pendingCakes, icon: <Clock className="text-blue-500" />, trend: 'Requires baking', color: 'border-blue-500/20' },
        { title: 'Menu Items', value: stats.activeProducts, icon: <Package className="text-purple-500" />, trend: 'Active on site', color: 'border-purple-500/20' },
    ];

    return (
        <div className="space-y-8 pb-10">
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-[#111111] border ${card.color} p-6 rounded-[2rem] transition-all hover:bg-white/[0.02]`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="p-3 bg-white/[0.03] rounded-2xl">
                                {card.icon}
                            </div>
                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">
                                {card.trend}
                            </span>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{card.title}</h3>
                            <p className="text-3xl font-black text-white mt-1">{card.value}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ORDER TRAJECTORY GRAPH */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-[#111111] border border-white/5 p-8 rounded-[2.5rem]"
                >
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
                                <Zap size={20} className="text-orange-500 fill-orange-500/20" />
                                Order Trajectory
                            </h2>
                            <p className="text-gray-500 text-xs mt-1">
                                Tracking total cakes sold across hours.
                            </p>
                        </div>
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <TrendingUp size={16} className="text-orange-500" />
                        </div>
                    </div>

                    <div style={{ width: "100%", height: 350 }}>
                        <ResponsiveContainer>
                            <AreaChart data={stats.trajectoryChart}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis
                                    dataKey="hour"
                                    stroke="#555"
                                    fontSize={10}
                                    tickMargin={10}
                                    interval={3}
                                />
                                <YAxis
                                    stroke="#555"
                                    fontSize={10}
                                    allowDecimals={false} // Orders are whole numbers
                                />
                                <Tooltip
                                    labelFormatter={(label, payload) => {
                                        return payload[0]?.payload?.fullTime || label;
                                    }}
                                    formatter={(value) => [`${value} Cakes`, "Total Sold"]}
                                    contentStyle={{
                                        backgroundColor: "#000",
                                        border: "1px solid #f9731633",
                                        borderRadius: "12px",
                                        fontSize: "12px"
                                    }}
                                    itemStyle={{ color: "#f97316" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count" // 🔥 Switching the graph to show counts
                                    stroke="#f97316"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* KITCHEN LOAD */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-[#111111] border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center text-center justify-center"
                >
                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 border border-orange-500/20">
                        <ShoppingBag className="text-orange-500" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Kitchen Load</h3>
                    <p className="text-gray-500 text-sm mt-3">
                        You have <span className="text-orange-500 font-bold">{stats.pendingCakes}</span> active tasks.
                    </p>
                    <div className="w-full h-px bg-white/5 my-8" />
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-[1.2rem] text-sm font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all cursor-pointer"
                    >
                        View Order List
                    </button>
                </motion.div>
            </div>
        </div>
    );
}