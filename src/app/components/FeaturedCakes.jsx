import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { OrderModal } from './ui/OrderModal';
import api from '../../lib/api';

export function FeaturedCakes() {
  const navigate = useNavigate();
  const [featuredCakes, setFeaturedCakes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCake, setSelectedCake] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 LIVE DATA FETCH ENGINE
  const fetchFeatured = async () => {
    try {
      const res = await api.get("/admin/products");
      const data = res.data;

      // Only show "Active" products and limit to top 6 for the home page
      const activeCakes = data
        .filter(p => p.status === 'Active')
        .slice(0, 6);

      setFeaturedCakes(activeCakes);
    } catch (err) {
      console.error("Error fetching featured cakes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial Load
    fetchFeatured();

    // 🔥 FOCUS-AWARE SYNC ENGINE: Re-fetch every 4 seconds when tab is active
    const liveInterval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchFeatured();
      }
    }, 4000);

    const handleFocus = () => {
      if (document.visibilityState === 'visible') fetchFeatured();
    };

    document.addEventListener('visibilitychange', handleFocus);
    return () => {
      clearInterval(liveInterval);
      document.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  const handleOrderClick = (cake) => {
    setSelectedCake(cake);
    setIsModalOpen(true);
  };

  const handleViewAll = () => { navigate('/cakes'); };

  const currentTime = useMemo(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  }, []);

  return (
    <section
      id="cakes"
      className="py-14 md:py-16 bg-gradient-to-b from-[#0F0F0F] via-[#0A0A0A] to-[#000000] selection:bg-[#D4AF37] selection:text-black"
    >
      <div className="site-container">
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cake={selectedCake}
        />

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-glow">
            Best Sellers & Featured Cakes
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Handcrafted with premium <strong>Pure Veg ingredients</strong>, delivered fresh in <strong>Mumbai</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-10 text-gray-500 italic">
              Loading our best Pure Veg creations...
            </div>
          ) : (
            featuredCakes.map((cake) => {
              // 🔥 DYNAMIC AVAILABILITY ENGINE
              const isSoldOut = cake.ordersToday >= cake.maxOrdersPerDay;
              const isTimeClosed = cake.cutoffTime && currentTime >= cake.cutoffTime;
              const isAvailable = cake.availableToday && !isSoldOut && !isTimeClosed;

              return (
                <Card
                  key={cake._id}
                  className="bg-[#141414] border border-white/5 overflow-hidden rounded-[2.5rem] shadow-2xl hover:border-[#D4AF37]/30 transition-all duration-500 flex flex-col h-full group"
                >
                  {/* Image & Centered Category Badge */}
                  <div className="relative h-64 overflow-hidden">
                    <ImageWithFallback
                      src={cake.image}
                      alt={`${cake.name} - Fresh homemade Pure Veg cake in Mumbai`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute left-4 top-4 flex justify-center">
                      <span className="bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.15em] flex items-center shadow-2xl">
                        {cake.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                      {cake.name}
                    </h3>
                    <p className="text-gray-500 text-xs mb-8 line-clamp-2 italic leading-relaxed">
                      "{cake.description}"
                    </p>

                    <div className="mt-auto space-y-6">
                      {/* Pricing Grid with High Contrast */}
                      <div className="bg-[#0D0D0D] rounded-[1.8rem] p-5 border border-white/5 space-y-4 shadow-inner">
                        {cake.variants && cake.variants.length > 0 ? (
                          cake.variants.slice(0, 2).map((v, i) => (
                            <div key={i} className={`flex justify-between items-center ${i !== 0 ? 'pt-4 border-t border-white/5' : ''}`}>
                              <div className="flex flex-col gap-0.5">
                                <span className="text-gray-100 text-[11px] font-black uppercase tracking-wider">{v.sizeName}</span>
                                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter flex items-center gap-1">
                                  <Users size={10} className="text-[#D4AF37]/50" /> {v.serves || 'Standard'}
                                </span>
                              </div>
                              <span className="text-xl font-black text-[#D4AF37] tracking-tighter">₹{v.price}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex justify-between items-center">
                            <div className="flex flex-col">
                              <span className="text-gray-100 text-[11px] font-black uppercase tracking-wider">Standard Size</span>
                              <span className="text-[9px] text-gray-500 font-bold">Standard Serving</span>
                            </div>
                            <span className="text-xl font-black text-[#D4AF37]">₹{cake.price}</span>
                          </div>
                        )}
                      </div>

                      <Button
                        disabled={!isAvailable}
                        onClick={() => handleOrderClick(cake)}
                        className={`w-full font-black rounded-2xl py-8 transition-all duration-300 shadow-xl flex items-center justify-center gap-3 ${isAvailable
                          ? 'bg-[#D4AF37] hover:bg-white text-black active:scale-95'
                          : 'bg-white/5 text-gray-600 cursor-not-allowed grayscale'
                          }`}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="uppercase tracking-widest text-xs font-black">
                          {isAvailable ? 'Order Now' : isTimeClosed ? 'Orders Closed' : 'Sold Out'}
                        </span>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <div className="flex justify-center mt-14">
          <Button
            onClick={handleViewAll}
            className="bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-full px-12 py-7 text-lg font-black transition-all duration-300 hover:cursor-pointer uppercase tracking-widest shadow-lg active:scale-95"
          >
            Explore Full Menu
          </Button>
        </div>
      </div>
    </section>
  );
}