import { Phone, MapPin, Instagram, Mail, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // 1. Added necessary imports

export function Footer() {
  const navigate = useNavigate(); // 2. Initialize navigate
  const location = useLocation(); // 3. Initialize location

  const handleWhatsApp = () => {
    const message = 'Hi! I would like to know more about your cakes.';
    const whatsappUrl = `https://wa.me/7304382291?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // 4. Helper function to handle navigation and scrolling
  const handleNavigation = (id) => {
    if (location.pathname !== '/') {
      // If we are not on the home page, navigate home first, then scroll
      navigate('/', { state: { targetId: id } });
      // Note: You may need a small useEffect in your Home.jsx to read this state and scroll
    } else {
      // If already home, just scroll
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer id="contact" className="bg-gradient-to-b from-[#1A120B] via-[#120A06] to-[#000000] text-white">

      <div className="site-container py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Naazie's Eats & Treats
            </h3>
            <p className="text-white/80 mb-4 max-w-md">
              Homemade fresh cakes in Mumbai. We bake with love and use only the finest halal ingredients to make your celebrations special.
            </p>
            <Button
              onClick={handleWhatsApp}
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full hover:cursor-pointer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Order on WhatsApp
            </Button>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-white/80">
              <div className="flex items-start gap-2 hover:cursor-pointer" onClick={handleWhatsApp}>
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>+91 7304382291</p>
                  <p className="text-sm">Call or WhatsApp</p>
                </div>
              </div>
              <div className="flex items-start gap-2 hover:cursor-pointer">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <p className="break-all">naazies.eatsntreats@gmail.com</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p>Mumbai / Mumbra</p>
                  <p className="text-sm">Maharashtra, India</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-white/80 flex flex-col items-start">
              <button
                onClick={() => handleNavigation('cakes')}
                className="block hover:text-white transition-colors hover:cursor-pointer text-left"
              >
                Our Cakes
              </button>
              <button
                onClick={() => handleNavigation('custom-orders')}
                className="block hover:text-white transition-colors hover:cursor-pointer text-left"
              >
                Custom Orders
              </button>
              <button
                onClick={() => handleNavigation('about')}
                className="block hover:text-white transition-colors hover:cursor-pointer text-left"
              >
                About Us
              </button>
              {/* 5. Changed from <a> to <Link> to trigger Router and ComingSoon page */}
              <Link
                to="/privacy-policy"
                className="block hover:text-white transition-colors hover:cursor-pointer"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-and-conditions"
                className="block hover:text-white transition-colors hover:cursor-pointer"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p className="text-white/80">Follow Us:</p>
              <a
                href="https://www.instagram.com/naazies986?igsh=aHhraTN0eGppaG41"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <p className="text-white/60 text-sm">
              Open: Daily 9:00 AM - 9:00 PM
            </p>
          </div>
        </div>
      </div>

      <div className="bg-black/20 pb-5">
        <div className="site-container">
          <p className="text-center text-white/60 text-sm">
            © {new Date().getFullYear()} Naazie's Eats & Treats. All rights reserved. Made with ❤️ in Mumbai
          </p>
        </div>
      </div>
    </footer>
  );
}