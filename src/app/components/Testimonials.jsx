import { Star } from 'lucide-react';
import { Card } from './ui/card';

const testimonials = [
  { name: 'Ayesha Khan', location: 'Mumbai', rating: 5, text: "The custom chocolate cake for my daughter was beautifully decorated and delicious! Highly recommend.", date: 'Jan 2026' },
  { name: 'Zainab Ahmed', location: 'Mumbai', rating: 5, text: "Best halal cakes in Mumbai. The vanilla dream was divine!", date: 'Feb 2026' },
  { name: 'Mohammed Ansari', location: 'Mumbra', rating: 5, text: "Professional quality and amazing strawberry cake. Five stars!", date: 'Jan 2026' },
];

export function Testimonials() {
  return (
    <section className="min-h-screen flex items-center bg-gradient-to-b from-[#FFF8F0] to-[#ffc0c0] py-14 md:py-16">

      <div className="site-container w-full">

        {/* PREMIUM KHLA-STYLE HEADING */}
        <div className="text-center mb-16 md:mb-20">

          {/* Top label with divider */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-[1px] w-10 bg-[#D4AF37]/60"></div>
            <span className="text-[#B8860B] text-xs tracking-[0.25em] uppercase font-semibold">
              Family Favorites
            </span>
            <div className="h-[1px] w-10 bg-[#D4AF37]/60"></div>
          </div>

          {/* Main heading */}
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#2C2416] leading-tight">
            Loved by Our Community
          </h2>

          {/* Subtitle */}
          <p className="mt-6 text-lg md:text-xl text-[#6B5D4F] max-w-2xl mx-auto leading-relaxed">
            Real stories from families who celebrate their special moments with our cakes.
          </p>

        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="p-8 bg-white/80 backdrop-blur-md border border-black/5 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, j) => (
                  <Star
                    key={j}
                    className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 italic mb-8 leading-relaxed">
                "{t.text}"
              </p>

              {/* Footer */}
              <div className="border-t border-black/10 pt-6">
                <p className="font-bold text-[#2C2416]">{t.name}</p>
                <p className="text-xs text-[#B8860B] uppercase tracking-widest mt-1">
                  {t.location} • {t.date}
                </p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
}