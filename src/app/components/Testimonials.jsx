import { Star, ExternalLink } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

const testimonials = [
  {
    name: 'Zaid Chopra',
    location: 'Mumbai',
    rating: 5,
    text: "I just wanted to thank you personally for the wonderful cake you created in honour of my Daughter's First birthday. I was so impressed and so was everyone else!!!",
    date: '2 years ago'
  },
  {
    name: 'Arfaat Fakir',
    location: 'Mumbai',
    rating: 5,
    text: "Been craving an authentic Black Forest cake... Absolutely fantastic in taste & appearance. The customer service is top notch as well and delivery always on time.",
    date: '2 years ago'
  },
  {
    name: 'Adnan Kazi',
    location: 'Mumbra',
    rating: 5,
    text: "Cakes are fresh and yummy, Taste of cake is best, Also customised with customer choice. They have variety of cake. Chocolate truffle are tasty...",
    date: '2 years ago'
  },
];

export function Testimonials() {
  const googleReviewUrl = "https://www.google.com/search?q=Naazie%27s+Eats+%26+Treats+Reviews";

  return (
    <section id="testimonials" className="min-h-screen flex items-center bg-gradient-to-b from-[#FFF8F0] to-[#ffc0c0] py-16 md:py-24">
      <div className="site-container w-full">
        <div className="text-center mb-16 md:mb-20">
          <div className="flex items-center justify-center gap-4 mb-5">
            <div className="h-[1px] w-10 bg-[#D4AF37]/60"></div>
            <span className="text-[#B8860B] text-xs tracking-[0.25em] uppercase font-semibold">
              Verified Google Reviews
            </span>
            <div className="h-[1px] w-10 bg-[#D4AF37]/60"></div>
          </div>

          <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#2C2416] leading-tight">
            Loved by Our Community
          </h2>

          <div className="mt-8 flex flex-col items-center gap-6">
            <p className="text-lg text-[#6B5D4F] max-w-2xl mx-auto leading-relaxed">
              Real stories from families in <strong>Mumbai & Mumbra</strong> who celebrate with our <strong>homemade Pure Veg cakes</strong>.
            </p>

            <Button
              onClick={() => window.open(googleReviewUrl, '_blank')}
              className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-full px-8 py-6 flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
              Read all reviews on Google
              <ExternalLink size={14} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {testimonials.map((t, i) => (
            <Card key={i} className="flex flex-col p-8 bg-white/90 backdrop-blur-md border border-white/20 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex gap-1 mb-6">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]" />
                ))}
              </div>

              {/* Flex-grow ensures the container is uniform, line-clamp-3 handles the text height */}
              <div className="flex-grow">
                <blockquote className="text-gray-700 italic leading-relaxed text-lg line-clamp-3">
                  "{t.text}"
                </blockquote>
              </div>

              {/* Footer aligned perfectly in one line across all cards */}
              <div className="mt-8 pt-6 border-t border-black/5">
                <cite className="font-bold text-[#2C2416] not-italic block text-lg">{t.name}</cite>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-[#B8860B] uppercase tracking-widest font-semibold">
                    {t.location}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {t.date}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}