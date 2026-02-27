import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit2, Plus, Loader2, Search, X, ImageIcon, Link as LinkIcon, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

export function Products() {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [imageSource, setImageSource] = useState('upload'); 

    const [formData, setFormData] = useState({
        name: '', category: '', price: '', size: '1kg', description: '',
        image: null, imageUrl: '', 
        availableToday: true, maxOrdersPerDay: 5,
        advanceHoursRequired: 24, cutoffTime: "18:00", status: 'Active'
    });

    const fetchData = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                api.get('/admin/categories'),
                api.get('/admin/products')
            ]);
            setCategories(catRes.data);
            setProducts(prodRes.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'imageUrl') return;

            if (key === 'image') {
                if (imageSource === 'upload' && formData.image) {
                    data.append('image', formData.image);
                } else if (imageSource === 'url' && formData.imageUrl) {
                    data.append('image', formData.imageUrl); 
                }
                return;
            }
            data.append(key, formData[key]);
        });

        try {
            const url = editingId ? `/admin/products/${editingId}` : '/admin/products';
            const method = editingId ? 'put' : 'post';
            await api[method](url, data);
            toast.success(editingId ? "Product Updated!" : "Cake Added Successfully!");
            setShowModal(false);
            setEditingId(null);
            fetchData();
        } catch (err) {
            toast.error("Error saving product");
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this cake?")) return;
        try {
            await api.delete(`/admin/products/${id}`);
            toast.success("Product Deleted");
            fetchData();
        } catch { toast.error("Delete failed"); }
    };

    const toggleStatus = async (id) => {
        try { await api.patch(`/admin/products/${id}/status`); fetchData(); }
        catch { toast.error("Status update failed"); }
    };

    const toggleAvailability = async (id) => {
        try { await api.patch(`/admin/products/${id}/availability`); fetchData(); }
        catch { toast.error("Availability update failed"); }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Product Inventory</h1>
                    <p className="text-gray-500 text-sm">Manage cakes, prices, and cutoff times.</p>
                </div>
                <Button onClick={() => {
                    setEditingId(null);
                    setImageSource('upload');
                    setFormData({
                        name: '', category: '', price: '', size: '1kg', description: '',
                        image: null, imageUrl: '', availableToday: true, maxOrdersPerDay: 5,
                        advanceHoursRequired: 24, cutoffTime: "18:00", status: 'Active'
                    });
                    setShowModal(true);
                }} className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-6 rounded-xl flex items-center gap-2 w-full sm:w-auto">
                    <Plus size={20} /> Add New Cake
                </Button>
            </div>

            <div className="bg-[#141414] border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
                {/* 🔥 Added overflow-x-auto to allow horizontal scrolling on mobile */}
                <div className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-gray-800">
                    <table className="w-full text-left min-w-[900px]">
                        <thead className="bg-white/[0.02] text-gray-500 uppercase text-[11px] tracking-widest border-b border-white/5">
                            <tr>
                                <th className="px-8 py-5 text-gray-400">Product Details</th>
                                <th className="px-8 py-5 text-gray-400">Category</th>
                                <th className="px-8 py-5 text-gray-400">Capacity (Today)</th>
                                <th className="px-8 py-5 text-gray-400">Price</th>
                                <th className="px-8 py-5 text-gray-400">Actions</th>
                                <th className="px-8 py-5 text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="px-8 py-5 flex items-center gap-4">
                                        <img src={product.image} className="w-12 h-12 rounded-lg object-cover border border-white/10" alt="" />
                                        <div>
                                            <p className="font-bold">{product.name}</p>
                                            <p className="text-gray-500 text-[10px]">#{product._id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="bg-white/5 px-3 py-1 rounded-full text-xs text-gray-400 border border-white/5">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between w-24 text-[10px] text-gray-500 font-bold uppercase">
                                                <span>Used</span>
                                                <span>Max</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-bold ${product.ordersToday >= product.maxOrdersPerDay ? 'text-red-500' : 'text-green-400'}`}>
                                                    {product.ordersToday} / {product.maxOrdersPerDay}
                                                </span>
                                                <button onClick={() => toggleAvailability(product._id)}
                                                    className={`w-2 h-2 rounded-full ${product.availableToday ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-white">₹{product.price}</td>
                                    <td className="px-8 py-5">
                                        <div className="flex gap-4">
                                            <Edit2 size={18} className="text-gray-400 hover:text-[#D4AF37] cursor-pointer" onClick={() => {
                                                setEditingId(product._id);
                                                setImageSource('url'); 
                                                setFormData({ ...product, imageUrl: product.image });
                                                setShowModal(true);
                                            }} />
                                            <Trash2 size={18} className="text-gray-400 hover:text-red-500 cursor-pointer" onClick={() => handleDelete(product._id)} />
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <button onClick={() => toggleStatus(product._id)} className={`px-4 py-1 rounded-full text-[10px] font-black uppercase border ${product.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-gray-500/10 text-gray-500 border-white/10"}`}>
                                            {product.status}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-y-auto">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="relative bg-[#111111] w-full max-w-2xl rounded-[1.5rem] border border-white/10 shadow-2xl overflow-hidden my-auto">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-white">{editingId ? "Edit Product" : "Create Product"}</h2>
                                    <p className="text-gray-500 text-xs mt-1">Configure delivery windows and order limits.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleUpload} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar bg-black/20">
                                <div className="flex gap-2 p-1 bg-black rounded-xl border border-white/5">
                                    <button type="button" onClick={() => setImageSource('upload')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${imageSource === 'upload' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                                        <ImageIcon size={14} /> Device Upload
                                    </button>
                                    <button type="button" onClick={() => setImageSource('url')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${imageSource === 'url' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-white'}`}>
                                        <LinkIcon size={14} /> Image URL
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[11px] font-bold uppercase tracking-wider ml-1">
                                        {imageSource === 'upload' ? "Select Image File" : "Paste Image URL"}
                                    </label>

                                    {imageSource === 'upload' ? (
                                        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-orange-500/50 transition-colors cursor-pointer group relative bg-black/40">
                                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })} />
                                            <ImageIcon className="mx-auto h-8 w-8 text-gray-600 mb-2 group-hover:text-orange-500 transition-colors" />
                                            <p className="text-xs text-gray-500 font-medium">{formData.image ? formData.image.name : "Drop cake image here"}</p>
                                        </div>
                                    ) : (
                                        <div className="relative group">
                                            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500" size={18} />
                                            <Input
                                                placeholder="https://images.unsplash.com/photo-..."
                                                value={formData.imageUrl}
                                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                className="bg-black border-white/10 text-white h-12 pl-12 focus:border-orange-500"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
                                        <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Product Status</label>
                                        <button type="button" onClick={() => setFormData({ ...formData, status: formData.status === 'Active' ? 'Inactive' : 'Active' })}
                                            className={`w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${formData.status === 'Active' ? 'bg-emerald-500 text-black' : 'bg-gray-700 text-gray-300'}`}>
                                            {formData.status}
                                        </button>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col gap-3">
                                        <label className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Accept Orders</label>
                                        <button type="button" onClick={() => setFormData({ ...formData, availableToday: !formData.availableToday })}
                                            className={`w-fit px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${formData.availableToday ? 'bg-green-500 text-black' : 'bg-red-600 text-white'}`}>
                                            {formData.availableToday ? "Available" : "Closed"}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-[11px] font-bold uppercase tracking-wider ml-1">Product Name</label>
                                        <Input placeholder="e.g. Royal Truffle" value={formData.name} required className="bg-black border-white/10 text-white h-12" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-gray-400 text-[11px] font-bold uppercase tracking-wider ml-1">Category</label>
                                            <select required className="w-full h-12 bg-black border border-white/10 rounded-lg px-4 text-white text-sm"
                                                value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                                <option value="">Select</option>
                                                {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-gray-400 text-[11px] font-bold uppercase tracking-wider ml-1">Price (₹)</label>
                                            <Input type="number" required value={formData.price} className="bg-black border-white/10 h-12" onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl space-y-5">
                                    <h3 className="text-orange-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2"><Clock size={14} /> Delivery Controls</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-gray-400 text-[11px] font-bold uppercase tracking-wider ml-1">Daily Capacity</label>
                                            <Input type="number" value={formData.maxOrdersPerDay} className="bg-black border-white/10 h-12" onChange={(e) => setFormData({ ...formData, maxOrdersPerDay: Number(e.target.value) })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-gray-400 text-[11px] font-bold uppercase tracking-wider ml-1">Cutoff Time</label>
                                            <Input type="time" value={formData.cutoffTime} className="bg-black border-white/10 h-12" onChange={(e) => setFormData({ ...formData, cutoffTime: e.target.value })} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[11px] font-bold uppercase tracking-wider ml-1">Description</label>
                                    <textarea className="w-full bg-black border border-white/10 rounded-lg p-4 text-white text-sm focus:border-orange-500 outline-none min-h-[100px]"
                                        value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the cake..." />
                                </div>

                                <div className="flex gap-4 pt-4 pb-2">
                                    <Button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-transparent border border-white/10 text-white hover:bg-white/5 h-14 rounded-xl font-bold">Cancel</Button>
                                    <Button disabled={loading} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-14 rounded-xl font-bold transition-all">
                                        {loading ? <Loader2 className="animate-spin" /> : editingId ? "Update Product" : "Create Product"}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}