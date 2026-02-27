import { Search, Settings, CreditCard, Truck, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse Veg Cakes',
    description: 'Explore our 100% Pure Veg cake collection or choose a design you love'
  },
  {
    number: '02',
    icon: Settings,
    title: 'Message on WhatsApp',
    description: 'Tap order and chat with us directly to place your custom request'
  },
  {
    number: '03',
    icon: CreditCard,
    title: 'Confirm Order',
    description: 'Finalize flavour, weight, message, date & delivery details'
  },
  {
    number: '04',
    icon: Truck,
    title: 'Fresh Delivery',
    description: 'Your Veg cake is prepared fresh and delivered on your selected date'
  },
];

export function OrderingProcess() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Order Homemade Pure Veg Cakes from Naazie's",
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title,
      "text": step.description
    }))
  };

  return (
    <section className="py-14 md:py-16 bg-gradient-to-b from-[#FFF8F0] to-[#ffc0c0] overflow-hidden">
      <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
      <div className="site-container">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-[#D4AF37] text-xs tracking-[0.25em] uppercase font-semibold mb-3 inline-block">
            Simple Ordering Process
          </span>

          <h2 className="text-3xl md:text-5xl font-bold text-[#2B2B2B] mb-6 text-balance">
            Baked Fresh in <strong>Mumbai</strong>, <br /> Made With Love
          </h2>

          <p className="text-[#5A5A5A] text-lg leading-relaxed">
            Every <strong>homemade Pure Veg cake</strong> is prepared in our home kitchen using quality ingredients, custom designs, and heartfelt care.
          </p>

          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-10"></div>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-[14%] right-[14%] border-t-2 border-dashed border-[#D4AF37]/40 z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mt-[93px]">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative text-center group z-10">
                  <div className="relative">
                    <div className="w-32 h-32 bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:border-[#D4AF37] transition-all duration-300">
                      <Icon className="h-12 w-12 text-[#D4AF37]" aria-hidden="true" />
                      <div className="absolute -top-2 bg-[#D4AF37] text-black font-bold text-xs px-3 py-1 rounded-full">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-[#2B2B2B] mb-2">
                    {step.title}
                  </h3>

                  <p className="text-[#6B6B6B] text-sm leading-relaxed">
                    {step.description}
                  </p>

                  {index < steps.length - 1 && (
                    <div className="lg:hidden mt-8 text-[#D4AF37]/60 animate-bounce">
                      <ArrowRight className="w-6 h-6 rotate-90 mx-auto" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}