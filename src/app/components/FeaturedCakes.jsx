import { useState, useEffect, useMemo } from 'react';
import { ShoppingCart } from 'lucide-react';
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

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await Promise.all([
          api.get("/admin/products")
        ]);
        const data = res[0].data;

        // Only ACTIVE cakes shown
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
    fetchFeatured();
  }, []);

  const handleOrderClick = (cake) => {
    setSelectedCake(cake);
    setIsModalOpen(true);
  };

  const handleViewAll = () => { navigate('/cakes'); };

  // 🔥 CURRENT TIME (HH:MM)
  const currentTime = useMemo(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  }, []);

  return (
    <section
      id="cakes"
      className="py-14 md:py-16 bg-gradient-to-b from-[#0F0F0F] via-[#0A0A0A] to-[#000000]"
    >
      <div className="site-container">
        <OrderModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          cake={selectedCake}
        />

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 text-glow">
            Featured Cakes
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Handcrafted with premium ingredients, delivered fresh to your door.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-10 text-gray-500">
              Loading our best creations...
            </div>
          ) : (
            featuredCakes.map((cake) => {
              // 🔥 AVAILABILITY ENGINE
              const isSoldOut = cake.ordersToday >= cake.maxOrdersPerDay;

              const isTimeClosed = cake.cutoffTime && currentTime >= cake.cutoffTime;

              const isAvailable = cake.availableToday && !isSoldOut && !isTimeClosed;

              return (
                <Card
                  key={cake._id}
                  className="bg-[#1A1A1A] border border-white/5 overflow-hidden rounded-2xl shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-300"
                >
                  <div className="relative h-72 overflow-hidden">
                    <ImageWithFallback
                      src={cake.image}
                      alt={cake.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">
                        {cake.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {cake.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2">
                      {cake.description}
                    </p>

                    <div className="bg-black/40 border border-white/5 rounded-xl p-4 mb-6 space-y-2">
                      <div className="flex justify-between font-bold text-[#D4AF37]">
                        <span>Price:</span>
                        <span className="text-2xl">₹{cake.price}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 text-right uppercase tracking-tighter">
                        Size: {cake.size}
                      </p>
                    </div>

                    <Button
                      disabled={!isAvailable}
                      onClick={() => handleOrderClick(cake)}
                      className={`w-full font-bold rounded-full py-6 hover:cursor-pointer transition-all ${isAvailable
                        ? 'bg-[#D4AF37] hover:bg-[#B8860B] text-black'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {isAvailable
                        ? 'Order Now'
                        : isTimeClosed
                          ? 'Orders Closed for Today'
                          : isSoldOut
                            ? 'Sold Out Today'
                            : 'Currently Unavailable'}
                    </Button>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        <div className="flex justify-center mt-14">
          <Button
            onClick={handleViewAll}
            className="bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-full px-10 py-6 text-lg font-semibold transition-all duration-300 hover:cursor-pointer"
          >
            View All Cakes
          </Button>
        </div>
      </div>
    </section>
  );
}