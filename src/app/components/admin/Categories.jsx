import React, { useState, useEffect } from 'react';
import { Tag, Trash2, Edit2, Loader2, X, Plus, FolderTree } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

export function Categories() {
    const [categories, setCategories] = useState([]);
    const [newCat, setNewCat] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/categories');
            setCategories(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to load categories");
        }
    };

    useEffect(() => { fetchCategories(); }, []);

    const handleAction = async () => {
        if (!newCat) return toast.error("Please enter a category name");
        setLoading(true);
        try {
            if (editingId) {
                await api.put(`/admin/categories/${editingId}`, { name: newCat });
                toast.success("Category updated successfully");
            } else {
                await api.post('/admin/categories', { name: newCat });
                toast.success("New category created");
            }
            setNewCat('');
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            toast.error(err.response?.data?.message || "Action failed");
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This might affect products in this category.")) return;
        try {
            await api.delete(`/admin/categories/${id}`);
            toast.success("Category removed");
            fetchCategories();
        } catch (err) { toast.error("Delete failed"); }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                        <FolderTree className="text-[#D4AF37]" size={32} />
                        Menu Structure
                    </h2>
                    <p className="text-gray-500 text-sm mt-1 ml-11">Organize your cakes and treats by collections.</p>
                </div>
                <div className="bg-[#1A1A1A] border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {categories.length} Total Categories
                    </span>
                </div>
            </div>

            {/* Input Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#111111] border border-white/10 p-1 md:p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/5 blur-[60px] rounded-full group-hover:bg-[#D4AF37]/10 transition-colors" />

                <div className="relative p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center">
                                <Plus className="text-[#D4AF37]" size={18} />
                            </div>
                            {editingId ? "Modify Category" : "Add New Collection"}
                        </div>
                        {editingId && (
                            <button
                                onClick={() => { setEditingId(null); setNewCat(''); }}
                                className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-1.5 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-full"
                            >
                                <X size={12} /> Cancel Edit
                            </button>
                        )}
                    </h3>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Input
                                value={newCat}
                                onChange={(e) => setNewCat(e.target.value)}
                                placeholder="e.g. Signature Dark Chocolate"
                                className="bg-black/40 border-white/5 h-14 pl-6 rounded-2xl text-white focus:border-[#D4AF37]/50 focus:ring-0 transition-all placeholder:text-gray-700"
                            />
                        </div>
                        <Button
                            onClick={handleAction}
                            disabled={loading}
                            className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black h-14 px-10 rounded-2xl cursor-pointer shadow-[0_10px_20px_rgba(212,175,55,0.1)] transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : editingId ? "Save Changes" : "Create Collection"}
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* List Table */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-[#111111] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-10 py-6 text-gray-500 uppercase text-[10px] font-black tracking-[0.2em]">Collection Name</th>
                                <th className="px-10 py-6 text-gray-500 uppercase text-[10px] font-black tracking-[0.2em] text-right">Management</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            <AnimatePresence mode='popLayout'>
                                {categories.map((cat, index) => (
                                    <motion.tr
                                        key={cat._id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all group"
                                    >
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-black border border-white/5 flex items-center justify-center text-[#D4AF37] font-bold group-hover:border-[#D4AF37]/30 transition-all">
                                                    {cat.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-base tracking-tight">{cat.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(cat._id);
                                                        setNewCat(cat.name);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all cursor-pointer"
                                                    title="Edit Collection"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(cat._id)}
                                                    className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                                                    title="Delete Collection"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {categories.length === 0 && (
                    <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
                        <div className="p-4 bg-white/5 rounded-full">
                            <Tag className="text-gray-600" size={32} />
                        </div>
                        <p className="text-gray-500 italic text-sm">No categories created yet. Start by adding one above.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
}