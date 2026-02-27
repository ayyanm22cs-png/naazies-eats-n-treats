import { useState, useMemo, useEffect } from 'react';
import { ShoppingCart, ArrowLeft, Filter, IndianRupee, Search, SlidersHorizontal, X } from 'lucide-react';
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

    // 🔥 CURRENT TIME
    const currentTime = useMemo(() => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    }, []);

    // Fetch dynamic data from Admin API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    api.get("/admin/products"),
                    api.get("/admin/categories")
                ]);

                const products = prodRes.data;
                const cats = catRes.data;

                // Only show "Active" products
                setAllCakes(products.filter(p => p.status === 'Active'));

                const formattedCats = [
                    { id: 'all', label: 'All Collection' },
                    ...cats.map(c => ({ id: c.name.toLowerCase(), label: c.name }))
                ];
                setCategories(formattedCats);
            } catch (err) {
                console.error("Error loading cakes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, []);

    const handleOrderClick = (cake) => {
        setSelectedCake(cake);
        setIsModalOpen(true);
    };

    const filteredCakes = useMemo(() => {
        return allCakes.filter(cake => {
            const categoryMatch = activeCategory === 'all' || cake.category.toLowerCase() === activeCategory.toLowerCase();
            const priceMatch = cake.price <= maxPrice;
            const searchMatch = cake.name.toLowerCase().includes(searchQuery.toLowerCase());
            return categoryMatch && priceMatch && searchMatch;
        });
    }, [activeCategory, maxPrice, searchQuery, allCakes]);

    const FilterContent = () => (
        <div className="space-y-10">
            <div>
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                    <Filter size={20} className="text-[#D4AF37]" /> Categories
                </h3>
                <div className="flex flex-col gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setActiveCategory(cat.id);
                                setIsFilterDrawerOpen(false);
                            }}
                            className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                                ? 'bg-[#D4AF37] text-black font-bold shadow-lg'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-8 border-t border-white/5">
                <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                    <IndianRupee size={20} className="text-[#D4AF37]" /> Price Range
                </h3>
                <input
                    type="range" min="100" max="3000" step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                />
                <div className="flex justify-between mt-4 text-gray-400 text-sm font-medium">
                    <span>Under ₹{maxPrice}</span>
                    <span className="text-[#D4AF37]">Max ₹3000</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
            <div className="site-container">
                <Link to="/" className="inline-flex items-center text-[#D4AF37] hover:text-[#B8860B] transition-colors mb-8 group">
                    <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="flex flex-col lg:flex-row gap-10">
                    <aside className="hidden lg:block lg:w-72 flex-shrink-0">
                        <div className="sticky top-28 bg-[#141414] border border-white/5 p-8 rounded-[2rem] shadow-2xl">
                            <FilterContent />
                        </div>
                    </aside>

                    <AnimatePresence>
                        {isFilterDrawerOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    onClick={() => setIsFilterDrawerOpen(false)}
                                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] lg:hidden"
                                />
                                <motion.aside
                                    initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-[#141414] z-[200] p-8 lg:hidden overflow-y-auto"
                                >
                                    <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                        <h2 className="text-xl font-bold text-white">Filters</h2>
                                        <button onClick={() => setIsFilterDrawerOpen(false)} className="text-gray-400"><X size={24} /></button>
                                    </div>
                                    <FilterContent />
                                    <Button className="w-full mt-10 bg-[#D4AF37] text-black font-bold" onClick={() => setIsFilterDrawerOpen(false)}>
                                        Show Results
                                    </Button>
                                </motion.aside>
                            </>
                        )}
                    </AnimatePresence>

                    <div className="flex-1">
                        <div className="flex flex-col gap-6 mb-10">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Our Menu</h1>
                                    <p className="text-gray-500 text-sm">
                                        {loading ? "Loading cakes..." : `Showing ${filteredCakes.length} handcrafted treats`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsFilterDrawerOpen(true)}
                                    className="lg:hidden flex items-center gap-2 bg-[#D4AF37] text-black px-4 py-2.5 rounded-xl font-bold text-sm shadow-lg"
                                >
                                    <SlidersHorizontal size={18} /> Filters
                                </button>
                            </div>

                            <div className="relative w-full group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37]" size={20} />
                                <Input
                                    placeholder="Search flavors, cakes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-12 h-14 bg-[#141414] border-white/5 text-white rounded-2xl"
                                />
                            </div>
                        </div>

                        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                            <OrderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cake={selectedCake} />
                            <AnimatePresence mode='popLayout'>
                                {filteredCakes.map((cake) => {

                                    // 🔥 FINAL ORDER AVAILABILITY ENGINE
                                    const isSoldOut = cake.ordersToday >= cake.maxOrdersPerDay;
                                    const isTimeClosed = cake.cutoffTime && currentTime >= cake.cutoffTime;

                                    const isAvailable =
                                        cake.availableToday &&
                                        !isSoldOut &&
                                        !isTimeClosed;

                                    return (
                                        <motion.div key={cake._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                                            <Card className="bg-[#1A1A1A] border border-white/5 overflow-hidden rounded-[1.5rem] shadow-2xl hover:border-[#D4AF37]/40 transition-all h-full flex flex-col">
                                                <div className="relative h-56 sm:h-64 overflow-hidden">
                                                    <ImageWithFallback src={cake.image} alt={cake.name} className="w-full h-full object-cover hover:scale-110" />
                                                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                                        <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest">
                                                            {cake.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-5 flex flex-col flex-1">
                                                    <h3 className="text-lg font-bold text-white mb-2">{cake.name}</h3>
                                                    <p className="text-gray-400 text-xs mb-6 line-clamp-2 italic leading-relaxed">
                                                        "{cake.description}"
                                                    </p>

                                                    <div className="mt-auto space-y-4">
                                                        <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex justify-between items-center">
                                                            <span className="text-xl font-black text-[#D4AF37]">₹{cake.price}</span>
                                                            <span className="text-[10px] text-gray-500 uppercase font-bold">{cake.size}</span>
                                                        </div>

                                                        <Button
                                                            disabled={!isAvailable}
                                                            onClick={() => handleOrderClick(cake)}
                                                            className={`w-full font-black rounded-xl py-6 ${isAvailable
                                                                ? 'bg-[#D4AF37] hover:bg-[#B8860B] text-black'
                                                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                                }`}
                                                        >
                                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                                            {isAvailable
                                                                ? "Order Now"
                                                                : isTimeClosed
                                                                    ? "Orders Closed for Today"
                                                                    : isSoldOut
                                                                        ? "Sold Out Today"
                                                                        : "Currently Unavailable"}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </motion.div>

                        {!loading && filteredCakes.length === 0 && (
                            <div className="text-center py-20 text-gray-500 italic">
                                No cakes found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}