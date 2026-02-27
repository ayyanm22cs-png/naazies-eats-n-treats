import { Phone, MapPin, Instagram, Mail, MessageCircle, Code2, ShieldCheck, Zap, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleWhatsApp = () => {
    const message = 'Hi! I would like to know more about your cakes.';
    const whatsappUrl = `https://wa.me/917304382291?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNavigation = (id) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { targetId: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "Naazie's Eats & Treats",
    "description": "Homemade fresh 100% Pure Veg cakes in Mumbai & Mumbra. Specializing in custom birthday and anniversary cakes.",
    "url": "https://naazieseatsntreats.vercel.app/",
    "telephone": "+917304382291",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbra, Thane",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "openingHours": "Mo-Su 09:00-21:00"
  };

  return (
    <footer id="contact" className="bg-gradient-to-b from-[#1A120B] via-[#120A06] to-[#000000] text-white">
      <script type="application/ld+json">
        {JSON.stringify(businessSchema)}
      </script>

      {/* Reduced vertical padding here to fix the space issue */}
      <div className="site-container py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Naazie's Eats & Treats
              </h3>
              <p className="text-white/70 mb-6 max-w-md leading-relaxed">
                Handcrafted <strong>homemade fresh Pure Veg cakes in Mumbai</strong>. We bake with love and use only the finest ingredients to make your celebrations special.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <ShieldCheck className="text-[#D4AF37] h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/90">100% Pure Veg</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <Zap className="text-[#D4AF37] h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/90">Baked to Order</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <Heart className="text-[#D4AF37] h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wider text-white/90">Homemade Love</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-[#D4AF37] tracking-tight">Contact Us</h4>
            <div className="space-y-4 text-white/80">
              <div className="flex items-start gap-3 hover:text-[#D4AF37] transition-colors cursor-pointer group" onClick={handleWhatsApp}>
                <div className="bg-white/5 p-2 rounded-lg group-hover:bg-[#D4AF37]/10 transition-colors">
                  <Phone className="h-5 w-5 flex-shrink-0" />
                </div>
                <div>
                  <p className="font-medium text-white">+91 7304382291</p>
                  <p className="text-xs text-white/50">Call or WhatsApp</p>
                </div>
              </div>

              <a href="mailto:naazies.eatsntreats@gmail.com" className="flex items-start gap-3 hover:text-[#D4AF37] transition-colors group">
                <div className="bg-white/5 p-2 rounded-lg group-hover:bg-[#D4AF37]/10 transition-colors">
                  <Mail className="h-5 w-5 flex-shrink-0" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-white truncate">naazies.eatsntreats@gmail.com</p>
                  <p className="text-xs text-white/50">Official Email</p>
                </div>
              </a>

              <div className="flex items-start gap-3 group">
                <div className="bg-white/5 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-white/70" />
                </div>
                <div>
                  <p className="font-medium text-white">Mumbai / Mumbra</p>
                  <p className="text-xs text-white/50">Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6 text-[#D4AF37] tracking-tight">Quick Links</h4>
            <nav className="space-y-3 text-white/70 flex flex-col items-start" aria-label="Footer Navigation">
              <button onClick={() => handleNavigation('cakes')} className="hover:text-[#D4AF37] transition-all hover:translate-x-1 duration-200 text-left">Browse Our Cakes</button>
              <button onClick={() => handleNavigation('custom-orders')} className="hover:text-[#D4AF37] transition-all hover:translate-x-1 duration-200 text-left">Custom Cake Requests</button>
              <button onClick={() => handleNavigation('about')} className="hover:text-[#D4AF37] transition-all hover:translate-x-1 duration-200 text-left">About Our Home Bakery</button>
              <Link to="/privacy-policy" className="hover:text-[#D4AF37] transition-all hover:translate-x-1 duration-200">Privacy Policy</Link>
              <Link to="/terms-and-conditions" className="hover:text-[#D4AF37] transition-all hover:translate-x-1 duration-200">Terms & Conditions</Link>
            </nav>
          </div>
        </div>

        {/* Reduced top margin here from mt-12 to mt-8 */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <span className="text-white/60 text-sm font-medium">Follow Us:</span>
              <a
                href="https://www.instagram.com/naazies986?igsh=aHhraTN0eGppaG41"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Naazie's on Instagram"
                className="bg-white/5 hover:bg-[#D4AF37]/20 p-2.5 rounded-full transition-all hover:scale-110 border border-white/5 hover:border-[#D4AF37]/30"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm italic">
              <Zap className="h-4 w-4 text-[#D4AF37]" />
              <span>Operational Hours: Daily 9:00 AM - 9:00 PM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black/40 py-6 border-t border-white/5">
        <div className="site-container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-[10px] uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} Naazie's Eats & Treats. Handcrafted in <strong>Mumbai</strong>
          </p>

          <div className="flex items-center gap-3 group">
            <Code2 className="h-4 w-4 text-white/20 group-hover:text-[#D4AF37] transition-colors" />
            <p className="text-white/30 text-[10px] uppercase tracking-[0.15em]">
              Designed & Developed by{" "}
              <span className="text-white/60 font-bold group-hover:text-[#D4AF37] transition-all duration-300">
                Ayyan Malim
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}