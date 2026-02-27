import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion } from 'framer-motion';

export function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "Naazie's Eats & Treats",
    "image": "https://naazieseatsntreats.vercel.app/logo3.png",
    "@id": "https://naazieseatsntreats.vercel.app",
    "url": "https://naazieseatsntreats.vercel.app",
    "telephone": "+917304382291",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mumbra",
      "addressLocality": "Thane",
      "addressRegion": "Maharashtra",
      "postalCode": "400612",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 19.1764,
      "longitude": 73.0232
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "21:00"
    },
    "sameAs": [
      "https://www.instagram.com/naazies986"
    ]
  };

  return (
    <section id="home" className="relative pt-12 pb-6 md:pt-14 md:pb-12 lg:pt-0 lg:pb-0 bg-gradient-to-b from-[#FFF8F0] to-[#ffc0c0]
    min-h-[calc(100vh-70px)] md:min-h-[calc(100vh-80px)] flex items-start lg:items-center overflow-hidden">
      <script type="application/ld+json">
        {JSON.stringify(jsonLdData)}
      </script>

      {/* subtle background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,200,200,0.25),transparent_40%)] pointer-events-none"></div>

      <div className="site-container">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] xl:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-16 xl:gap-24 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="order-1 text-center lg:text-left mx-auto lg:mx-0 max-w-xl pt-4 md:pt-6 lg:pt-0"
          >
            <div className="inline-block bg-white/70 backdrop-blur-md text-[#8B5A3C] px-5 py-2 rounded-full text-sm lg:text-base mb-5 shadow-sm">
              ✨ Freshly Baked Daily in Mumbai
            </div>

            {/* Standardized 2-line heading */}
            <h1 className="font-bold text-gray-900 mb-5 leading-tight text-[clamp(2.2rem,4vw,3.9rem)]">
              Homemade Fresh <br className="hidden md:block" /> Cakes in Mumbai
            </h1>

            <p className="text-gray-700 mb-6 text-[clamp(1rem,1.4vw,1.4rem)]">
              100% Pure Veg • Freshly baked • Custom designs available
            </p>

            <p className="text-gray-700 mb-9 max-w-xl text-[clamp(0.95rem,1.1vw,1.15rem)]">
              Celebrate every moment with our handcrafted <strong>Pure Veg cakes</strong>, made with love
              and the finest ingredients. Perfect for birthdays, anniversaries,
              and special occasions at <strong>Naazie's Eats & Treats</strong>.
            </p>

            <div className="w-full flex flex-col md:flex-row lg:flex-row gap-3 mt-3 justify-center md:justify-start">
              <Button
                onClick={() => scrollToSection('cakes')}
                aria-label="Browse our Veg cake collection"
                className="w-full md:w-1/2 lg:w-auto bg-[#8B5A3C] hover:bg-[#704728] text-white rounded-full py-5 lg:py-6
                px-8 lg:px-10 text-base lg:text-lg shadow-md hover:shadow-xl transition-all duration-300 hover:cursor-pointer"
              >
                Browse Cakes
              </Button>

              <Button
                onClick={() => scrollToSection('custom-orders')}
                variant="outline"
                aria-label="Request a custom Pure Veg cake design"
                className="w-full md:w-1/2 lg:w-auto border-2 border-[#8B5A3C] text-[#8B5A3C] hover:bg-[#8B5A3C] hover:text-white
                rounded-full py-5 lg:py-6 px-8 lg:px-10 text-base lg:text-lg shadow-sm hover:shadow-md transition-all duration-300 hover:cursor-pointer"
              >
                Custom Order
              </Button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }} className="order-2 lg:ml-6 mb-8 lg:mb-0"
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#FFE5E5] rounded-full opacity-40 blur-2xl"></div>
              <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-[#F5E6D3] rounded-full opacity-40 blur-2xl"></div>

              <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)] max-w-[90%] md:max-w-full mx-auto">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1581797833924-255242b10b3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Delicious Homemade Pure Veg Chocolate Cake from Naazie's Eats & Treats Mumbai"
                  className="w-full h-[280px] sm:h-[340px] md:h-[420px] lg:h-[480px] xl:h-[520px] object-cover
                    transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}