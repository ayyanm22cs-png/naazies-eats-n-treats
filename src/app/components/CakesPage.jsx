import { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, Filter, IndianRupee, Search, SlidersHorizontal, X, Users, ChevronDown, ListChecks } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderModal } from './ui/OrderModal';
import api from '../../lib/api';

export default function CakesPage() {
    const [allCakes, setAllCakes] = useState([]);
    const [categories, setCategories] = useState([{ id: 'all', label: 'All Collection' }]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [maxPrice, setMaxPrice] = useState(3000);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCake, setSelectedCake] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openSizeDropdown, setOpenSizeDropdown] = useState(null);

    const fetchCakes = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                api.get("/admin/products"),
                api.get("/admin/categories")
            ]);
            setAllCakes(prodRes.data.filter(p => p.status === 'Active'));
            const formattedCats = [
                { id: 'all', label: 'All Collection' },
                ...catRes.data.map(c => ({ id: c.name.toLowerCase(), label: c.name }))
            ];
            setCategories(formattedCats);
        } catch (err) {
            console.error("Sync error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCakes();
        const syncInterval = setInterval(fetchCakes, 10000);
        return () => clearInterval(syncInterval);
    }, []);

    const handleOrderClick = (cake) => {
        setSelectedCake(cake);
        setIsModalOpen(true);
    };

    const currentTime = useMemo(() => {
        const now = new Date();
        return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    }, []);

    const filteredCakes = useMemo(() => {
        return allCakes.filter(cake => {
            const categoryMatch = activeCategory === 'all' || cake.category?.toLowerCase() === activeCategory.toLowerCase();
            const priceMatch = cake.variants?.some(v => v.price <= maxPrice) || cake.price <= maxPrice;
            const searchMatch = cake.name?.toLowerCase().includes(searchQuery.toLowerCase());
            return categoryMatch && priceMatch && searchMatch;
        });
    }, [activeCategory, maxPrice, searchQuery, allCakes]);

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-18 pb-20 selection:bg-[#D4AF37] selection:text-black">
            <div className="site-container">
                <Link to="/" className="inline-flex items-center text-[#D4AF37] hover:text-[#B8860B] transition-colors mb-6 group text-sm font-medium">
                    <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="flex flex-col lg:flex-row gap-10">

                    {/* --- 🖥️ STICKY DESKTOP SIDEBAR WITH INTERNAL SCROLL --- */}
                    <aside className="hidden lg:block lg:w-80 flex-shrink-0">
                        <div className="sticky top-10 h-[calc(100vh-5rem)]">
                            {/* The container below is the one that scrolls internally */}
                            <div
                                className="bg-[#141414] border border-white/5 rounded-[2rem] p-8 shadow-2xl h-full overflow-y-auto no-scrollbar"
                                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                            >
                                <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                                <FilterContent
                                    categories={categories}
                                    activeCategory={activeCategory}
                                    setActiveCategory={setActiveCategory}
                                    maxPrice={maxPrice}
                                    setMaxPrice={setMaxPrice}
                                />
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="flex flex-col gap-6 mb-10">
                            <div className="flex justify-between items-end">
                                <header>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Our Cake Menu</h1>
                                    <p className="text-gray-500 text-sm italic">
                                        {loading ? "Refreshing availability..." : "Handcrafted Pure Veg treats available in Mumbai"}
                                    </p>
                                </header>
                                <button onClick={() => setIsFilterDrawerOpen(true)} className="lg:hidden flex items-center gap-2 bg-[#D4AF37] text-black px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all">
                                    <SlidersHorizontal size={18} /> Filters
                                </button>
                            </div>
                            <div className="relative w-full group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37]" size={20} />
                                <Input placeholder="Search cake flavors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-14 bg-[#141414] border-white/5 text-white rounded-2xl" />
                            </div>
                        </div>

                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            <OrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cake={selectedCake} />
                            <AnimatePresence mode="popLayout">
                                {filteredCakes.map((cake) => {
                                    const isSoldOut = (cake.ordersToday || 0) >= (cake.maxOrdersPerDay || 0);
                                    const isTimeClosed = cake.cutoffTime && currentTime >= cake.cutoffTime;
                                    const isAvailable = cake.availableToday && !isSoldOut && !isTimeClosed;

                                    return (
                                        <motion.div key={cake._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <Card className="bg-[#141414] border border-white/5 rounded-[2.5rem] overflow-visible h-full flex flex-col group hover:border-[#D4AF37]/30 transition-all duration-500 shadow-2xl relative">
                                                <div className="relative h-60 overflow-hidden rounded-t-[2.5rem]">
                                                    <ImageWithFallback src={cake.image} alt={cake.name} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${!isAvailable ? 'grayscale opacity-50' : ''}`} />
                                                    <div className="absolute inset-x-0 top-4 flex justify-center">
                                                        <span className="bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.15em] shadow-2xl">
                                                            {cake.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-6 flex flex-col flex-1">
                                                    <h3 className="text-xl font-bold text-white mb-2">{cake.name}</h3>
                                                    <p className="text-gray-400 text-xs mb-6 line-clamp-2 italic leading-relaxed min-h-[32px]">"{cake.description}"</p>
                                                    <div className="mt-auto space-y-5 relative">
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setOpenSizeDropdown(openSizeDropdown === cake._id ? null : cake._id)}
                                                                className="w-full bg-[#0D0D0D] border border-white/10 rounded-[1.8rem] p-5 flex justify-between items-center z-20 relative"
                                                            >
                                                                <div className="text-left">
                                                                    <p className="text-gray-100 text-[11px] font-black uppercase tracking-wider">{cake.variants?.[0]?.sizeName}</p>
                                                                    <p className="text-xl font-black text-[#D4AF37]">₹{cake.variants?.[0]?.price}</p>
                                                                </div>
                                                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${openSizeDropdown === cake._id ? 'rotate-180' : ''}`} />
                                                            </button>
                                                            <AnimatePresence>
                                                                {openSizeDropdown === cake._id && (
                                                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-[100] mt-3 w-full bg-[#0D0D0D] border border-white/10 rounded-[1.5rem] shadow-2xl p-4 space-y-3 top-full left-0">
                                                                        {cake.variants?.map((v, idx) => (
                                                                            <div key={idx} className="flex justify-between items-center text-sm text-white">
                                                                                <span className="font-medium text-xs">{v.sizeName}</span>
                                                                                <span className="text-[#D4AF37] font-black text-sm">₹{v.price}</span>
                                                                            </div>
                                                                        ))}
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                        <Button
                                                            disabled={!isAvailable}
                                                            onClick={() => handleOrderClick(cake)}
                                                            className={`w-full font-black rounded-2xl py-8 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 relative z-10 ${isAvailable ? 'bg-[#D4AF37] hover:bg-white text-black active:scale-95' : 'bg-white/5 text-gray-600 cursor-not-allowed grayscale'}`}
                                                        >
                                                            <ShoppingCart className="h-5 w-5" />
                                                            <span className="uppercase tracking-widest text-xs font-black">{isAvailable ? "Order Now" : isTimeClosed ? "Orders Closed" : "Sold Out"}</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
                {isFilterDrawerOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsFilterDrawerOpen(false)} className="fixed inset-0 bg-black/90 backdrop-blur-md z-[500] lg:hidden" />
                        <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#0F0F0F] border-l border-white/10 z-[600] p-8 shadow-2xl overflow-y-auto lg:hidden">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-2"><Filter size={20} className="text-[#D4AF37]" /> Filters</h2>
                                <button onClick={() => setIsFilterDrawerOpen(false)} className="bg-white/5 p-2 rounded-full text-gray-400 hover:text-white transition-all"><X size={20} /></button>
                            </div>
                            <div className="space-y-12 pb-10">
                                <FilterContent
                                    categories={categories}
                                    activeCategory={activeCategory}
                                    setActiveCategory={(id) => { setActiveCategory(id); setIsFilterDrawerOpen(false); }}
                                    maxPrice={maxPrice}
                                    setMaxPrice={setMaxPrice}
                                    isMobile={true}
                                />
                                <Button onClick={() => setIsFilterDrawerOpen(false)} className="w-full bg-[#D4AF37] text-black font-black py-8 rounded-[1.5rem] shadow-2xl active:scale-95 transition-all text-xs uppercase tracking-widest">
                                    Apply & Show Results
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

function FilterContent({ categories, activeCategory, setActiveCategory, maxPrice, setMaxPrice, isMobile = false }) {
    return (
        <div className="space-y-12">
            <div className="space-y-6">
                <h3 className="text-white/50 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <ListChecks size={14} className="text-[#D4AF37]" /> {isMobile ? "Select Collection" : "Categories"}
                </h3>
                <div className="flex flex-col gap-1.5">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`text-left px-5 py-3.5 rounded-xl text-sm transition-all duration-300 border ${activeCategory === cat.id
                                ? 'bg-[#D4AF37] text-black font-black border-[#D4AF37] shadow-lg scale-[1.03]'
                                : 'bg-white/[0.02] text-gray-400 border-white/5 hover:bg-white/5 hover:text-white'}`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-10 border-t border-white/5 space-y-8">
                <h3 className="text-white/50 font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                    <IndianRupee size={14} className="text-[#D4AF37]" /> Your Budget
                </h3>
                <div className="space-y-6">
                    <input
                        type="range" min="100" max="3000" step="50"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                    <div className="flex justify-between items-center bg-black/50 p-4 rounded-xl border border-white/5">
                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-tight">Under:</span>
                        <span className="text-[#D4AF37] text-base font-black tracking-tighter">₹{maxPrice}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}