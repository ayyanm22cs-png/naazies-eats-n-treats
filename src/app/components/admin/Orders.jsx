import React, { useEffect, useState } from 'react';
import { ShoppingBag, Clock, CheckCircle, MessageCircle, Edit3, Check, X as CloseIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

export function Orders() {
    const [orders, setOrders] = useState([]);
    const [updatingId, setUpdatingId] = useState(null);

    // 🔥 State for Inline Price Editing
    const [editingPriceId, setEditingPriceId] = useState(null);
    const [tempPrice, setTempPrice] = useState("");

    const fetchOrders = async () => {
        try {
            const res = await api.get('/admin/orders');
            setOrders(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            toast.error("Failed to load orders");
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (order, newStatus) => {
        setUpdatingId(order._id);
        try {
            const res = await api.patch(`/admin/orders/${order._id}/status`, { status: newStatus });
            if (res.status === 200) {
                toast.success(`Order marked as ${newStatus}`);
                fetchOrders();

                let waMessage = "";
                const customerName = order.customerName;
                const cakeName = order.cakeFlavor;

                switch (newStatus) {
                    case 'Confirmed':
                        waMessage = `Hi ${customerName}! 👋 Your order for "${cakeName}" has been *Confirmed*. We are starting the baking process! 🎂`;
                        break;
                    case 'Completed':
                        waMessage = `Hi ${customerName}! 🌟 Your order for "${cakeName}" is now *Completed* and ready/delivered. Thank you for choosing Naazie's Eats & Treats! ❤️`;
                        break;
                    case 'Cancelled':
                        waMessage = `Hi ${customerName}, we're sorry to inform you that your order for "${cakeName}" has been *Cancelled*. Please contact us if you have any questions. 🙏`;
                        break;
                    default:
                        return;
                }

                if (waMessage) {
                    const waUrl = `https://wa.me/${order.phone.replace(/\D/g, '')}?text=${encodeURIComponent(waMessage)}`;
                    window.open(waUrl, '_blank');
                }
            }
        } catch (err) {
            toast.error("Status update failed");
        } finally {
            setUpdatingId(null);
        }
    };

    const handlePriceUpdate = async (id) => {
        try {
            await api.patch(`/admin/orders/${id}/price`, { totalPrice: Number(tempPrice) });
            toast.success("Price Updated");
            setEditingPriceId(null);
            fetchOrders();
        } catch (err) {
            toast.error("Failed to update price");
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Incoming Orders</h1>
            <div className="bg-[#141414] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
                {/* 🔥 Added overflow-x-auto to allow horizontal scrolling on mobile */}
                <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-800">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-white/[0.02] text-gray-500 uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Customer</th>
                                <th className="px-8 py-5">Cake Details</th>
                                <th className="px-8 py-5">Delivery Date</th>
                                <th className="px-8 py-5">Total</th>
                                <th className="px-8 py-5 text-right">Update Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="font-bold flex items-center gap-2">
                                            {order.customerName}
                                            {order.orderType === 'Custom' && (
                                                <span className="bg-purple-500/10 text-purple-400 text-[8px] px-2 py-0.5 rounded-full border border-purple-500/20 uppercase font-black">
                                                    Custom
                                                </span>
                                            )}
                                            <a href={`https://wa.me/${order.phone}`} target="_blank" rel="noreferrer">
                                                <MessageCircle size={14} className="text-green-500 hover:scale-110 transition-transform" />
                                            </a>
                                        </div>
                                        <div className="text-gray-500 text-xs">{order.phone}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="text-sm font-medium text-[#D4AF37]">{order.cakeFlavor}</div>
                                        <div className="text-gray-500 text-[10px] italic">"{order.cakeMessage}"</div>
                                    </td>
                                    <td className="px-8 py-5 text-sm">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Clock size={14} />
                                            {new Date(order.deliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        </div>
                                    </td>

                                    <td className="px-8 py-5">
                                        {editingPriceId === order._id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={tempPrice}
                                                    onChange={(e) => setTempPrice(e.target.value)}
                                                    className="w-20 bg-black border border-[#D4AF37] rounded px-2 py-1 text-sm text-white outline-none"
                                                    autoFocus
                                                />
                                                <button onClick={() => handlePriceUpdate(order._id)} className="text-green-500 hover:text-green-400"><Check size={16} /></button>
                                                <button onClick={() => setEditingPriceId(null)} className="text-red-500 hover:text-red-400"><CloseIcon size={16} /></button>
                                            </div>
                                        ) : (
                                            <div
                                                className="font-bold flex items-center gap-2 group cursor-pointer"
                                                onClick={() => {
                                                    setEditingPriceId(order._id);
                                                    setTempPrice(order.totalPrice);
                                                }}
                                            >
                                                {order.totalPrice > 0 ? `₹${order.totalPrice}` : <span className="text-purple-400 text-xs italic underline">Set Quote</span>}
                                                <Edit3 size={12} className="text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-8 py-5 text-right">
                                        <select
                                            disabled={updatingId === order._id}
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order, e.target.value)}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase border outline-none cursor-pointer transition-all ${order.status === 'Pending' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                order.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    order.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                                }`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Confirmed">Confirmed</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="text-center py-20 text-gray-600 italic">No orders found.</div>
                )}
            </div>
        </div>
    );
}