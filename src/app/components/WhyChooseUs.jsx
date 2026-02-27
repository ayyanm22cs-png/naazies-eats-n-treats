import { Heart, Shield, Sparkles, Palette, MapPin } from 'lucide-react';
import { Card } from './ui/card';

const features = [
  {
    icon: Heart,
    title: 'Homemade with Love',
    description:
      'Every cake is baked fresh in our home kitchen with care and passion',
  },
  {
    icon: Shield,
    title: 'Halal Ingredients',
    description:
      '100% halal certified ingredients for your peace of mind',
  },
  {
    icon: Sparkles,
    title: 'Fresh Preparation',
    description:
      'Baked on order to ensure maximum freshness and quality',
  },
  {
    icon: Palette,
    title: 'Custom Designs',
    description:
      'Personalized cakes tailored to your specific preferences',
  },
  {
    icon: MapPin,
    title: 'Mumbai Delivery',
    description:
      'Fast and reliable delivery across Mumbai and Mumbra',
  },
  {
    icon: Shield, // you can change icon if you want
    title: 'On-Time Delivery',
    description:
      'We ensure every cake reaches fresh and right on schedule',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FFF8F0] to-[#ffc0c0]">
      <div className="site-container">

        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={index}
                className="p-8 bg-white/70 backdrop-blur-sm border border-[#8B5A3C]/10 hover:bg-white transition-all shadow-lg"
              >
                <div className="flex flex-col items-center text-center">

                  {/* Icon */}
                  <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="h-10 w-10 text-[#8B5A3C]" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
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