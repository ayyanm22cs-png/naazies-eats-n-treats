import { useState, useEffect } from 'react';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { OrderModal } from './ui/OrderModal';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../lib/api';

export function FeaturedCakes() {

  const navigate = useNavigate();

  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCake, setSelectedCake] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSizeDropdown, setOpenSizeDropdown] = useState(null);

  // ✅ NEW: Track selected variant for each cake
  const [selectedVariants, setSelectedVariants] = useState({});

  const fetchFeatured = async () => {
    try {
      const res = await api.get("/admin/products");

      const activeCakes = res.data
        .filter(p => p.status === 'Active')
        .slice(0, 6);

      setFeaturedCakes(activeCakes);

      // ✅ NEW: Set default selected variant = first variant
      const initialVariants = {};
      activeCakes.forEach((cake) => {
        if (cake.variants?.length > 0) {
          initialVariants[cake._id] = cake.variants[0];
        }
      });
      setSelectedVariants(initialVariants);

    } catch (err) {
      console.error("Error fetching featured cakes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();

    const liveInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchFeatured();
      }
    }, 10000);

    const handleFocus = () => {
      if (document.visibilityState === 'visible') fetchFeatured();
    };

    document.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(liveInterval);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  // ✅ UPDATED: pass selected variant also
  const handleOrderClick = (cake) => {
    const selectedVariant = selectedVariants[cake._id] || cake.variants?.[0] || null;

    setSelectedCake({
      ...cake,
      selectedVariant
    });

    setIsModalOpen(true);
  };

  const handleViewAll = () => {
    navigate('/cakes');
  };

  // ✅ NEW: Variant select handler
  const handleVariantSelect = (cakeId, variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [cakeId]: variant
    }));
    setOpenSizeDropdown(null);
  };

  return (
    <section
      id="cakes"
      className="py-12 md:py-14 bg-gradient-to-b from-[#0F0F0F] via-[#0A0A0A] to-[#000000] selection:bg-[#D4AF37] selection:text-black"
    >
      <div className="site-container">

        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cake={selectedCake}
        />

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-glow">
            Best Sellers & Featured Cakes
          </h2>
          <p className="text-base text-gray-400 max-w-2xl mx-auto">
            Handcrafted with premium <strong>Pure Veg ingredients</strong>, delivered fresh in <strong>Mumbai</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

          {loading ? (
            <div className="col-span-full text-center py-8 text-gray-500 italic">
              Loading our best Pure Veg creations...
            </div>
          ) : (

            featuredCakes.map((cake) => {

              const isSoldOut =
                (cake.ordersToday || 0) >= (cake.maxOrdersPerDay || 0);

              const isAvailable =
                cake.availableToday &&
                !isSoldOut;

              // ✅ NEW: selected variant for this cake
              const selectedVariant = selectedVariants[cake._id] || cake.variants?.[0];

              return (
                <Card
                  key={cake._id}
                  className="bg-[#141414] border border-white/5 overflow-hidden rounded-[2rem] shadow-2xl hover:border-[#D4AF37]/30 transition-all duration-500 flex flex-col group"
                >

                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <ImageWithFallback
                      src={cake.image}
                      alt={cake.name}
                      className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ${!isAvailable ? 'grayscale opacity-50' : ''}`}
                    />
                    <div className="absolute left-4 top-4">
                      <span className="bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[#D4AF37] text-[9px] font-black uppercase tracking-[0.12em] shadow-2xl">
                        {cake.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">

                    <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
                      {cake.name}
                    </h3>

                    <p className="text-gray-500 text-[11px] mb-5 line-clamp-2 italic leading-relaxed">
                      "{cake.description}"
                    </p>

                    <div className="mt-auto space-y-4">

                      {/* Size Dropdown */}
                      <div className="relative">

                        <button
                          onClick={() =>
                            setOpenSizeDropdown(
                              openSizeDropdown === cake._id
                                ? null
                                : cake._id
                            )
                          }
                          className="w-full bg-[#0D0D0D] border border-white/10 rounded-[1.5rem] p-4 flex justify-between items-center"
                        >
                          <div className="text-left">
                            <p className="text-gray-100 text-[10px] font-black uppercase tracking-wider">
                              {selectedVariant?.sizeName}
                            </p>
                            <p className="text-lg font-black text-[#D4AF37]">
                              ₹{selectedVariant?.price}
                            </p>
                          </div>
                          <ChevronDown size={16} className="text-gray-400" />
                        </button>

                        <AnimatePresence>
                          {openSizeDropdown === cake._id && (
                            <motion.div
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -8 }}
                              className="absolute z-50 mt-2 w-full bg-[#0D0D0D] border border-white/10 rounded-[1.2rem] shadow-2xl p-3 space-y-2"
                            >
                              {cake.variants?.map((v, idx) => (
                                <button
                                  type="button"
                                  key={idx}
                                  onClick={() => handleVariantSelect(cake._id, v)}
                                  className={`w-full flex justify-between items-center text-xs rounded-lg px-3 py-2 transition-all ${selectedVariant?.sizeName === v.sizeName
                                      ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-white'
                                      : 'text-white hover:bg-white/5'
                                    }`}
                                >
                                  <span>{v.sizeName}</span>
                                  <span className="text-[#D4AF37] font-bold">
                                    ₹{v.price}
                                  </span>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                      </div>

                      <Button
                        disabled={!isAvailable}
                        onClick={() => handleOrderClick(cake)}
                        className={`w-full font-black rounded-xl py-5 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 text-xs ${isAvailable
                          ? 'bg-[#D4AF37] hover:bg-white text-black active:scale-95'
                          : 'bg-white/5 text-gray-600 cursor-not-allowed grayscale'
                          }`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {isAvailable ? 'Order Now' : 'Sold Out'}
                      </Button>

                    </div>
                  </div>

                </Card>
              );
            })
          )}
        </div>

        {/* Reduced Explore Button */}
        <div className="flex justify-center mt-10">
          <Button
            onClick={handleViewAll}
            className="bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-full px-8 py-4 text-sm font-black transition-all duration-300 uppercase tracking-widest shadow-lg active:scale-95"
          >
            Explore Full Menu
          </Button>
        </div>

      </div>
    </section>
  );
}