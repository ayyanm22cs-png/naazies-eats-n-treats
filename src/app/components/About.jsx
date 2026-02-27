import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  return (
    <section
      id="about"
      className="min-h-screen py-24 bg-gradient-to-b from-[#0F0F0F] via-[#0A0A0A] to-[#000000]"
    >
      <div className="site-container">

        {/* GRID — EXACT KHALLA STRUCTURE */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* LEFT COLUMN — STICKY APPLIED DIRECTLY HERE */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">

            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1656463490201-ba0acdd38930?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                alt="About Naazie's Eats & Treats"
                className="w-full h-[70vh] object-cover"
              />
            </div>

          </div>

          {/* RIGHT COLUMN — LONG CONTENT */}
          <div className="lg:col-span-7 space-y-12">

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              Our Story
            </h2>

            <div className="space-y-7 text-gray-300 leading-relaxed text-[15px]">

              <p>
                Naazie's Eats & Treats began in a small home kitchen with a simple
                intention — to bake fresh cakes for family celebrations.
                What started casually soon turned into something people began
                asking for again and again.
              </p>

              <p>
                Every cake we prepare is baked only after an order is placed.
                We don’t store, freeze, or rush anything. From choosing ingredients
                to final decoration, everything is handled with patience and care.
              </p>

              <p>
                We use good quality halal ingredients and focus on taste first.
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
                Being a home-based bakery in Mumbai allows us to stay close to
                our customers. Every order is handled like it’s meant for our own
                family celebration.
              </p>

              <p>
                Over time, this journey has become more than baking. It has become
                about trust — people trusting us with their special days and
                emotions.
              </p>

              <p className="text-[#D4AF37] font-semibold italic text-lg">
                "Baking happiness, one cake at a time."
              </p>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">

              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">500+</div>
                <div className="text-sm text-gray-400 mt-1">Happy Customers</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">100%</div>
                <div className="text-sm text-gray-400 mt-1">Halal Ingredients</div>
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