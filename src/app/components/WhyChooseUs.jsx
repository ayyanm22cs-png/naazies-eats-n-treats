import { Heart, Shield, Sparkles, Palette, MapPin, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';

const features = [
  {
    icon: Heart,
    title: 'Homemade with Love',
    description: 'Every cake is baked fresh in our home kitchen in Mumbai with care and passion',
  },
  {
    icon: Shield,
    title: '100% Pure Veg',
    description: 'We use premium Pure Veg certified ingredients for your peace of mind',
  },
  {
    icon: Sparkles,
    title: 'Fresh Preparation',
    description: 'Baked only on order to ensure maximum freshness and home-style quality',
  },
  {
    icon: Palette,
    title: 'Custom Cake Designs',
    description: 'Personalized cakes tailored to your specific birthdays and anniversary themes',
  },
  {
    icon: MapPin,
    title: 'Mumbai & Mumbra Delivery',
    description: 'Fast and reliable cake delivery across Mumbai and Mumbra neighborhoods',
  },
  {
    icon: CheckCircle,
    title: 'On-Time Delivery',
    description: 'We ensure every Pure Veg cake reaches fresh and right on schedule for your party',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FFF8F0] to-[#ffc0c0]" aria-labelledby="why-choose-heading">
      <div className="site-container">
        <div className="text-center mb-16">
          <h2 id="why-choose-heading" className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Naazie's Bakery?
          </h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="p-8 bg-white/70 backdrop-blur-sm border border-[#8B5A3C]/10 hover:bg-white transition-all shadow-lg"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="h-10 w-10 text-[#8B5A3C]" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}