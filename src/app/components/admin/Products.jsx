import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, Loader2, X, IndianRupee, ImageIcon, Link as LinkIcon, Search, Clock3, Save } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

export function Products() {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [imageSource, setImageSource] = useState('upload');
    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // ✅ GLOBAL CUTOFF TIME
    const [globalCutoffTime, setGlobalCutoffTime] = useState("18:00");
    const [savingCutoff, setSavingCutoff] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');

    const defaultFormData = {
        name: '',
        category: '',
        description: '',
        image: null,
        imageUrl: '',
        variants: [{ sizeName: '1/2 Kg', serves: '', price: '', stock: '10' }],
        availableToday: true,
        maxOrdersPerDay: 5,
        ordersToday: 0,
        cutoffTime: "18:00",
        status: 'Active'
    };

    const [formData, setFormData] = useState(defaultFormData);

    const fetchData = async () => {
        try {
            const [catRes, prodRes] = await Promise.all([
                api.get('/admin/categories'),
                api.get('/admin/products')
            ]);
            setCategories(catRes.data);
            setProducts(prodRes.data);

            // ✅ Pick first product cutoff as global display value
            if (prodRes.data.length > 0 && prodRes.data[0].cutoffTime) {
                setGlobalCutoffTime(prodRes.data[0].cutoffTime);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        if (formData.image instanceof File) {
            const objectUrl = URL.createObjectURL(formData.image);
            setPreviewUrl(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewUrl('');
        }
    }, [formData.image]);

    useEffect(() => {
        fetchData();
    }, []);

    const addSizeRow = () => {
        setFormData({
            ...formData,
            variants: [
                ...formData.variants,
                { sizeName: '', serves: '', price: '', stock: '10' }
            ]
        });
    };

    const removeSizeRow = (index) => {
        const updated = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: updated });
    };

    const updateVariant = (index, field, value) => {
        const updated = [...formData.variants];
        updated[index][field] = value;
        setFormData({ ...formData, variants: updated });
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('variants', JSON.stringify(formData.variants));

        Object.keys(formData).forEach(key => {
            if (key === 'imageUrl' || key === 'variants' || key === 'image' || key === 'cutoffTime') return;
            data.append(key, formData[key]);
        });

        // ✅ Always use global cutoff for all products
        data.append('cutoffTime', globalCutoffTime);

        if (imageSource === 'url') {
            data.append('image', formData.imageUrl);
        } else if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            const url = editingId ? `/admin/products/${editingId}` : '/admin/products';
            const method = editingId ? 'put' : 'post';
            await api[method](url, data);
            toast.success(editingId ? "Product Updated!" : "Cake Created!");
            setShowModal(false);
            setEditingId(null);
            setFormData(defaultFormData);
            setPreviewUrl('');
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
        setLoading(false);
    };

    // ✅ SAVE GLOBAL CUTOFF FOR ALL PRODUCTS
    const handleSaveGlobalCutoff = async () => {
        try {
            setSavingCutoff(true);
            await api.patch('/admin/products/cutoff/all', {
                cutoffTime: globalCutoffTime
            });
            toast.success("Global cutoff time updated for all cakes");
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update cutoff time");
        } finally {
            setSavingCutoff(false);
        }
    };

    const toggleAvailability = async (id) => {
        try {
            await api.patch(`/admin/products/${id}/availability`);
            toast.success("Availability Updated");
            fetchData();
        } catch {
            toast.error("Failed");
        }
    };

    const toggleStatus = async (id) => {
        try {
            await api.patch(`/admin/products/${id}/status`);
            fetchData();
        } catch {
            toast.error("Failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this cake?")) return;
        try {
            await api.delete(`/admin/products/${id}`);
            toast.success("Deleted");
            fetchData();
        } catch {
            toast.error("Failed");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-2xl font-bold text-white">Product Inventory</h1>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="relative group w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37]" size={16} />
                        <input
                            type="text"
                            placeholder="Search name or category..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#141414] border border-white/5 pl-10 pr-4 py-2 rounded-xl text-xs text-white outline-none focus:border-[#D4AF37]/50 transition-all shadow-xl"
                        />
                    </div>

                    {/* ✅ GLOBAL CUTOFF TIME */}
                    <div className="flex items-center gap-2 bg-[#141414] border border-white/5 rounded-xl px-3 py-2 shadow-xl w-full md:w-auto">
                        <Clock3 size={16} className="text-[#D4AF37]" />
                        <Input
                            type="time"
                            value={globalCutoffTime || "18:00"}
                            onChange={(e) => setGlobalCutoffTime(e.target.value)}
                            className="bg-transparent border-none text-white h-8 px-0 py-0 text-sm shadow-none focus-visible:ring-0 [color-scheme:dark]"
                        />
                        <Button
                            type="button"
                            onClick={handleSaveGlobalCutoff}
                            disabled={savingCutoff}
                            className="bg-[#D4AF37] hover:bg-[#c79f20] text-black h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-wider"
                        >
                            {savingCutoff ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                        </Button>
                    </div>

                    <Button
                        onClick={() => {
                            setEditingId(null);
                            setImageSource('upload');
                            setFormData({
                                ...defaultFormData,
                                cutoffTime: globalCutoffTime
                            });
                            setPreviewUrl('');
                            setShowModal(true);
                        }}
                        className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-6 rounded-xl flex items-center justify-center gap-2 shadow-lg"
                    >
                        <Plus size={20} /> Add New Cake
                    </Button>
                </div>
            </div>

            <div className="bg-[#141414] border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden">
                <div className="overflow-x-auto w-full">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-white/[0.02] text-gray-500 uppercase text-[10px] font-black tracking-[0.2em] border-b border-white/5">
                            <tr>
                                <th className="px-8 py-6">Product Details</th>
                                <th className="px-8 py-6">Category</th>
                                <th className="px-8 py-6">Capacity</th>
                                <th className="px-8 py-6">Sizes & Price</th>
                                <th className="px-8 py-6">Availability</th>
                                <th className="px-8 py-6">Status</th>
                                <th className="px-8 py-6 text-right px-10">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5 text-white">
                            {filteredProducts.map((p) => {
                                const variants = p.variants || [];
                                return (
                                    <tr key={p._id} className="hover:bg-white/[0.01] transition-colors">
                                        <td className="px-8 py-5 flex items-center gap-4">
                                            <div className="relative">
                                                <img src={p.image} className="w-14 h-14 rounded-2xl object-cover border border-white/10" alt={p.name} />
                                                <span className={`absolute top-0 -right-1 w-3 h-3 rounded-full border-2 border-[#141414] ${p.availableToday ? "bg-emerald-500" : "bg-red-500"}`} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-base">{p.name}</p>
                                                <p className="text-gray-500 text-[10px] font-mono">ID: {p._id.slice(-6).toUpperCase()}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 max-w-[200px]">
                                            <span className="inline-block max-w-[180px] truncate bg-white/5 px-4 py-1.5 rounded-full text-[10px] font-bold text-gray-400 border border-white/5">{p.category}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`text-sm font-black ${p.ordersToday >= p.maxOrdersPerDay ? 'text-red-500' : 'text-emerald-400'}`}>
                                                {p.ordersToday} / {p.maxOrdersPerDay}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 relative">
                                            {variants.length > 0 && (
                                                <div className="relative inline-block text-left">
                                                    <div className="text-[11px] text-orange-500 font-black">{variants[0].sizeName}: ₹{variants[0].price}</div>
                                                    {variants.length > 1 && (
                                                        <>
                                                            <button type="button" onClick={() => setOpenDropdown(openDropdown === p._id ? null : p._id)} className="text-[9px] text-gray-400 hover:text-white font-bold mt-1">+{variants.length - 1} more</button>
                                                            {openDropdown === p._id && (
                                                                <div className="absolute border border-white/10 z-50 mt-2 w-44 bg-[#141414] rounded-xl shadow-xl p-3 space-y-2">
                                                                    {variants.slice(1).map((v, i) => (
                                                                        <div key={i} className="text-[10px] text-orange-400 font-semibold border-b border-white/5 pb-1">{v.sizeName}: ₹{v.price}</div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-8 py-5">
                                            <button onClick={() => toggleAvailability(p._id)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all ${p.availableToday ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"}`}>{p.availableToday ? "Enabled" : "Disabled"}</button>
                                        </td>
                                        <td className="px-8 py-5">
                                            <button onClick={() => toggleStatus(p._id)} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border transition-all ${p.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-gray-500/10 text-gray-500 border-white/10 opacity-50"}`}>{p.status}</button>
                                        </td>
                                        <td className="px-8 py-5 text-right px-10">
                                            <div className="flex justify-end gap-4">
                                                <Edit2
                                                    size={18}
                                                    className="text-gray-400 hover:text-orange-500 cursor-pointer"
                                                    onClick={() => {
                                                        setEditingId(p._id);
                                                        setImageSource('url');
                                                        setFormData({
                                                            name: p.name || '',
                                                            category: p.category || '',
                                                            description: p.description || '',
                                                            image: null,
                                                            imageUrl: p.image || '',
                                                            variants: (p.variants || []).map(v => ({
                                                                sizeName: v.sizeName || '',
                                                                serves: v.serves || '',
                                                                price: v.price ?? '',
                                                                stock: v.stock ?? '10'
                                                            })),
                                                            availableToday: p.availableToday ?? true,
                                                            maxOrdersPerDay: p.maxOrdersPerDay ?? 5,
                                                            ordersToday: p.ordersToday ?? 0,
                                                            cutoffTime: globalCutoffTime || "18:00",
                                                            status: p.status || 'Active'
                                                        });
                                                        setPreviewUrl('');
                                                        setShowModal(true);
                                                    }}
                                                />
                                                <Trash2 size={18} className="text-gray-400 hover:text-red-500 cursor-pointer" onClick={() => handleDelete(p._id)} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-[#0F0F0F] w-full max-w-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-orange-500/5 to-transparent">
                                <h2 className="text-xl font-bold text-white">{editingId ? "Update Creation" : "New Creation"}</h2>
                                <button onClick={() => setShowModal(false)} className="bg-white/5 p-2 rounded-full text-gray-400 hover:text-white transition-all"><X size={20} /></button>
                            </div>

                            <form onSubmit={handleUpload} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Cake Name</label>
                                        <Input value={formData.name || ''} required className="bg-black border-white/10 h-12 rounded-xl" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Category</label>
                                        <select required className="w-full h-12 bg-black border border-white/10 rounded-xl px-4 text-white text-sm" value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                            <option value="">Select Category</option>
                                            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Description</label>
                                    <textarea className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm outline-none min-h-[100px]" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>

                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2"><IndianRupee size={14} className="text-orange-500" /> Size & Pricing</h3>
                                        <Button type="button" onClick={addSizeRow} className="bg-white text-black hover:bg-gray-200 h-8 rounded-lg text-[10px] font-black px-3"><Plus size={14} /> ADD SIZE</Button>
                                    </div>
                                    {formData.variants.map((v, i) => (
                                        <div key={i} className="grid grid-cols-12 gap-2 items-end bg-black/40 p-3 rounded-xl border border-white/5">
                                            <div className="col-span-3"><Input placeholder="Size" value={v.sizeName || ''} required onChange={(e) => updateVariant(i, 'sizeName', e.target.value)} className="bg-black border-white/10 h-9 text-xs" /></div>
                                            <div className="col-span-3"><Input placeholder="Serves" value={v.serves || ''} onChange={(e) => updateVariant(i, 'serves', e.target.value)} className="bg-black border-white/10 h-9 text-xs" /></div>
                                            <div className="col-span-3"><Input type="number" placeholder="Price" value={v.price ?? ''} required onChange={(e) => updateVariant(i, 'price', e.target.value)} className="bg-black border-white/10 h-9 text-xs" /></div>
                                            <div className="col-span-2"><Input type="number" value={v.stock ?? ''} onChange={(e) => updateVariant(i, 'stock', e.target.value)} className="bg-black border-white/10 h-9 text-xs" /></div>
                                            <button type="button" onClick={() => removeSizeRow(i)} className="col-span-1 text-gray-600 hover:text-red-500 pb-2"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>

                                {/* ✅ CAPACITY SETTINGS ONLY */}
                                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-4">
                                    <h3 className="text-white font-black text-xs uppercase tracking-widest">
                                        Capacity Settings
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                                Max Orders Per Day
                                            </label>
                                            <Input
                                                type="number"
                                                value={formData.maxOrdersPerDay ?? 0}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        maxOrdersPerDay: Math.max(0, Number(e.target.value))
                                                    })
                                                }
                                                className="bg-black border-white/10 h-12 rounded-xl"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                                Orders Today (Manual)
                                            </label>
                                            <Input
                                                type="number"
                                                value={formData.ordersToday ?? 0}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        ordersToday: Math.max(0, Number(e.target.value))
                                                    })
                                                }
                                                className="bg-black border-white/10 h-12 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                                    <label className="text-gray-400 text-[10px] font-black uppercase tracking-widest block">Product Media</label>
                                    <div className="flex gap-2 p-1 bg-black rounded-xl border border-white/5">
                                        <button type="button" onClick={() => setImageSource('upload')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${imageSource === 'upload' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-white'}`}><ImageIcon size={14} /> Upload</button>
                                        <button type="button" onClick={() => setImageSource('url')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${imageSource === 'url' ? 'bg-orange-600 text-white' : 'text-gray-500 hover:text-white'}`}><LinkIcon size={14} /> URL</button>
                                    </div>

                                    <div className="flex gap-4 items-start">
                                        <div className="flex-1">
                                            {imageSource === 'upload' ? (
                                                <Input type="file" accept="image/*" className="bg-black border-white/10 h-12 pt-3" onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })} />
                                            ) : (
                                                <Input
                                                    placeholder="Paste DIRECT image link (e.g. .jpg, .png)"
                                                    value={formData.imageUrl || ''}
                                                    className="bg-black border-white/10 h-12"
                                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                />
                                            )}
                                        </div>

                                        {(formData.imageUrl || previewUrl) && (
                                            <div className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden bg-black flex-shrink-0">
                                                <img
                                                    src={imageSource === 'url' ? formData.imageUrl : previewUrl}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[9px] text-gray-500 italic">Tip: Link must end in .jpg, .png or be a direct image host link.</p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-white/5 text-white h-12 rounded-xl font-bold hover:bg-white/10">Discard</Button>
                                    <Button disabled={loading} className="flex-1 bg-orange-600 text-white h-12 rounded-xl font-black shadow-xl">
                                        {loading ? <Loader2 className="animate-spin" /> : editingId ? "Confirm Update" : "Finalize Creation"}
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