import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/images/logo2.png';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id) => {
    setIsMenuOpen(false);

    // If already on home page → scroll directly
    if (location.pathname === '/') {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to home page first
      navigate('/', { state: { scrollTo: id } });
    }
  };

  return (
    <nav className="sticky top-0 w-full z-[100] bg-black backdrop-blur-md border-b border-white/10 shadow-lg h-[70px] lg:h-[82px]">
      <div className="site-container h-full">
        <div className="flex justify-between items-center h-full relative">

          {/* Logo */}
          <div
            onClick={() => scrollToSection('home')}
            className="cursor-pointer relative z-50 h-full flex items-center"
          >
            <div className="absolute -top-5 lg:-top-7 -left-10 w-44 lg:w-52 transform-gpu transition-transform duration-300 hover:scale-105">
              <img
                src={logo}
                alt="Naazie's Eats & Treats"
                className="w-full h-auto object-contain drop-shadow-2xl"
                style={{ filter: 'brightness(1.1)' }}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'Cakes', 'Custom Orders', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() =>
                  scrollToSection(item.toLowerCase().replace(' ', '-'))
                }
                className="text-gray-300 hover:text-[#D4AF37] transition-colors font-medium text-md hover:cursor-pointer"
              >
                {item}
              </button>
            ))}

            <Button
              onClick={() => scrollToSection('cakes')}
              className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold rounded-full px-8 py-2 text-md ml-4 hover:cursor-pointer transition-colors"
            >
              Order Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-[#D4AF37]"
          >
            {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-black border-t border-white/10 shadow-xl z-40">
            <div className="flex flex-col gap-4 px-6 py-8">
              {['Home', 'Cakes', 'Custom Orders', 'About', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() =>
                    scrollToSection(item.toLowerCase().replace(' ', '-'))
                  }
                  className="text-left text-gray-300 hover:text-[#D4AF37] text-md py-3 border-b border-white/5"
                >
                  {item}
                </button>
              ))}

              <Button
                onClick={() => scrollToSection('cakes')}
                className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold rounded-full w-full mt-4 py-5 text-md"
              >
                Order Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}