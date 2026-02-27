import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  const aboutJsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    "name": "Naazie's Eats & Treats",
    "description": "A home-based bakery in Mumbai specializing in fresh, handcrafted 100% Pure Veg cakes for birthdays, anniversaries, and special celebrations.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Mumbra, Mumbai",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "knowsAbout": ["Baking", "Cake Design", "Pure Veg Food", "Custom Cakes"]
  };

  return (
    <section
      id="about"
      className="min-h-screen py-24 bg-gradient-to-b from-[#0F0F0F] via-[#0A0A0A] to-[#000000]"
    >
      <script type="application/ld+json">
        {JSON.stringify(aboutJsonLd)}
      </script>

      <div className="site-container">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1656463490201-ba0acdd38930?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="The artisanal Pure Veg baking process at Naazie's Eats & Treats Mumbai"
                className="w-full h-[70vh] object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Our Story
            </h2>

            <div className="space-y-7 text-gray-300 leading-relaxed text-[15px]">
              <p>
                <strong>Naazie's Eats & Treats</strong> began in a small home kitchen with a simple
                intention — to bake fresh <strong>Pure Veg cakes</strong> for family celebrations.
                What started casually soon turned into something people began
                asking for again and again.
              </p>

              <p>
                Every cake we prepare is baked only after an order is placed.
                We don’t store, freeze, or rush anything. From choosing ingredients
                to final decoration, everything is handled with patience and care to ensure the highest quality for our customers in <strong>Mumbai</strong>.
              </p>

              <p>
                We use good quality <strong>100% Pure Veg ingredients</strong> and focus on taste first.
                A cake should look beautiful, but it must taste even better —
                that has always been our belief.
              </p>

              <p>
                For us, this is not just a business. It’s about becoming part of
                someone’s happiest moments — birthdays, anniversaries, engagements,
                surprises, and small celebrations that matter the most.
              </p>

              <p>
                We personally talk to every customer on WhatsApp, understand their
                requirement, guide them on flavours and designs, and make sure the
                final cake matches exactly what they imagined.
              </p>

              <p>
                Being a home-based bakery in <strong>Mumbai</strong> allows us to stay close to
                our customers. Every order is handled like it’s meant for our own
                family celebration.
              </p>

              <p>
                Over time, this journey has become more than baking. It has become
                about trust — people trusting us with their special days and
                emotions.
              </p>

              {/* 🔥 The Digital Experience Credit */}
              <p className="pt-4 border-t border-white/5">
                Just as our cakes are crafted with personal attention, our digital experience
                has been handcrafted from scratch. This website was designed and developed by
                <span className="text-[#D4AF37] font-bold"> Ayyan Malim</span> to ensure that
                finding your perfect Pure Veg cake is as smooth and delightful as our frosting.
              </p>

              <p className="text-[#D4AF37] font-semibold italic text-lg">
                "Baking happiness, one Pure Veg cake at a time."
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">500+</div>
                <div className="text-sm text-gray-400 mt-1">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">100%</div>
                <div className="text-sm text-gray-400 mt-1">Pure Veg</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">Fresh</div>
                <div className="text-sm text-gray-400 mt-1">Daily Baking</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}