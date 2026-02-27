import { useState } from 'react';
import { Menu, X, Code2 } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; // 🔥 Added AnimatePresence
import logo from '../../assets/images/logo2.png';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  return (
    <nav className="sticky top-0 w-full z-[100] bg-black backdrop-blur-md border-b border-white/10 shadow-lg h-[70px] lg:h-[82px]" role="navigation" aria-label="Main Website Navigation">
      <div className="site-container h-full">
        <div className="flex justify-between items-center h-full relative">

          {/* Logo Section */}
          <div
            onClick={() => scrollToSection('home')}
            className="cursor-pointer relative z-50 h-full flex items-center"
            title="Go to Naazie's Eats & Treats Home"
          >
            <div className="absolute -top-5 lg:-top-7 -left-10 w-44 lg:w-52 transform-gpu transition-transform duration-300 hover:scale-105">
              <img
                src={logo}
                alt="Naazie's Eats & Treats - Best Homemade Cakes in Mumbai"
                className="w-full h-auto object-contain drop-shadow-2xl"
                loading="eager"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'Cakes', 'Custom Orders', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                className="text-gray-300 hover:text-[#D4AF37] transition-all font-medium text-md hover:cursor-pointer"
              >
                {item}
              </button>
            ))}
            <Button
              onClick={() => scrollToSection('cakes')}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold rounded-full px-8 py-2 text-md ml-4 hover:cursor-pointer transition-colors shadow-lg"
            >
              Order Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-[#D4AF37] z-[110]"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* --- MOBILE NAVIGATION DRAWER --- */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Dark Overlay/Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
              />

              {/* Side Drawer */}
              <motion.div
                initial={{ x: '100%' }} // Start off-screen (right)
                animate={{ x: 0 }}       // Slide to view
                exit={{ x: '100%' }}    // Slide back to right
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 h-screen w-[80%] max-w-[350px] bg-[#0A0A0A] border-l border-white/10 z-[105] lg:hidden shadow-2xl flex flex-col"
              >
                <div className="flex flex-col gap-2 px-8 py-24 overflow-y-auto">
                  {['Home', 'Cakes', 'Custom Orders', 'About', 'Contact'].map((item) => (
                    <button
                      key={item}
                      onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                      className="text-left text-gray-300 hover:text-[#D4AF37] text-xl py-4 border-b border-white/5 transition-colors font-semibold"
                    >
                      {item}
                    </button>
                  ))}

                  <Button
                    onClick={() => scrollToSection('cakes')}
                    className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black rounded-2xl w-full mt-6 py-7 text-lg shadow-[0_10px_20px_rgba(212,175,55,0.1)]"
                  >
                    Order Now
                  </Button>

                  {/* Developer Signature */}
                  <div className="mt-auto pt-10 pb-6 flex items-center justify-center gap-2 opacity-50">
                    <Code2 size={14} className="text-[#D4AF37]" />
                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                      Developed by <span className="text-white font-bold">Ayyan Malim</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}