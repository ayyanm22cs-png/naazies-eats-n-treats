import { useState, useMemo } from 'react'; // Added useMemo
import { Calendar, MessageSquare, Loader2, User, Phone, Sparkles, ChefHat, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import { motion } from 'framer-motion';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export function CustomOrderForm() {
  const [loading, setLoading] = useState(false);

  // --- Logic to Disable Past Dates & Apply Cutoff ---
  const minDate = useMemo(() => {
    const now = new Date();
    const currentHour = now.getHours();

    // If it's after 6:00 PM (18:00), the earliest delivery is tomorrow
    if (currentHour >= 18) {
      now.setDate(now.getDate() + 1);
    }

    return now.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  }, []);

  const orderSchema = {
    "@context": "https://schema.org",
    "@type": "OrderAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://wa.me/917304382291",
      "actionPlatform": ["http://schema.org/DesktopWebPlatform", "http://schema.org/MobileWebPlatform"]
    },
    "object": {
      "@type": "Product",
      "name": "Customized Cakes Mumbai"
    }
  };

  const softTransition = {
    type: "spring",
    duration: 1.2,
    bounce: 0.3,
    ease: "easeOut"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const orderData = {
      customerName: formData.get('customerName'),
      phone: formData.get('phone'),
      cakeFlavor: formData.get('flavor'),
      cakeWeight: formData.get('weight'),
      cakeMessage: formData.get('message'),
      deliveryDate: formData.get('date'),
      notes: formData.get('notes'),
      orderType: 'Custom',
      totalPrice: 0
    };

    try {
      const res = await api.post('/admin/orders/create', orderData);
      if (res.status === 201) {
        const message = `*New Custom Cake Request from Naazie's Website*%0A%0A` +
          `*Name:* ${orderData.customerName}%0A` +
          `*Flavor:* ${orderData.cakeFlavor}%0A` +
          `*Weight:* ${orderData.cakeWeight}%0A` +
          `*Message on Cake:* ${orderData.cakeMessage || 'N/A'}%0A` +
          `*Date:* ${orderData.deliveryDate}%0A` +
          `*Notes:* ${orderData.notes || 'None'}`;

        window.open(`https://wa.me/917304382291?text=${message}`, '_blank');
        toast.success("Request logged and WhatsApp opened!");
        e.target.reset();
      }
    } catch (err) {
      toast.error("Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="custom-orders" className="py-20 bg-gradient-to-b from-[#0F0F0F] via-[#0A0A0A] to-[#000000] overflow-hidden">
      <script type="application/ld+json">{JSON.stringify(orderSchema)}</script>

      <div className="site-container">
        <div className="grid lg:grid-cols-12 gap-12 items-center justify-center">

          {/* Left Side: Information & Branding */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={softTransition}
            className="lg:col-span-5 space-y-8 flex flex-col items-center lg:items-start"
          >
            <div className="text-center lg:text-left w-full">
              <span className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase text-sm mb-4 block">Tailor-Made Bakes</span>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Design Your <br />
                <span className="text-[#D4AF37]">Dream Cake</span>
              </h2>
            </div>

            <p className="text-gray-400 text-lg max-w-md text-center lg:text-left">
              From birthday themes to elegant anniversary tiers, we bring your sweet visions to life with our 100% Pure Veg expertise.
            </p>

            <div className="w-full flex justify-center lg:justify-start">
              <div className="space-y-6 w-fit text-left">
                {[
                  { icon: <Sparkles size={20} />, title: "Custom Artistry", desc: "Every design is unique to your celebration." },
                  { icon: <ChefHat size={20} />, title: "100% Pure Veg", desc: "Premium eggless ingredients, always fresh." },
                  { icon: <Clock size={20} />, title: "Mumbai Delivery", desc: "Reliable delivery across Mumbai & Mumbra." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-start group">
                    <div className="mt-1 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500 shadow-xl">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg leading-tight">{item.title}</h4>
                      <p className="text-gray-500 text-sm mt-1 max-w-[240px]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side: Glassmorphic Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={softTransition}
            className="lg:col-span-7 w-full"
          >
            <Card className="relative p-1 md:p-8 bg-white/[0.02] border border-white/10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 blur-[60px] rounded-full" />

              <form onSubmit={handleSubmit} className="relative space-y-6 p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <Input name="customerName" required className="pl-12 bg-black border-white/5 text-white h-14 rounded-2xl focus:border-[#D4AF37]/50" placeholder="Full Name" />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Contact Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <Input name="phone" required type="tel" className="pl-12 bg-black border-white/5 text-white h-14 rounded-2xl focus:border-[#D4AF37]/50" placeholder="WhatsApp Number" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Flavor Choice</Label>
                    <Select name="flavor" required>
                      <SelectTrigger className="bg-black border-white/5 text-white h-14 rounded-2xl">
                        <SelectValue placeholder="Select Flavor" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-white/10 text-white">
                        {['Chocolate', 'Vanilla', 'Red Velvet', 'Strawberry', 'Black Forest', 'Butterscotch', 'Custom Flavor'].map(f => (
                          <SelectItem key={f} value={f}>{f}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Delivery Date</Label>
                    <div className="relative">
                      <Input
                        type="date"
                        name="date"
                        required
                        min={minDate} // 🔥 Blocks past dates automatically
                        onClick={(e) => e.target.showPicker()}
                        className="bg-black border-white/5 text-white h-14 rounded-2xl w-full pr-10 cursor-pointer"
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37]" size={18} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-left">
                    <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Approx. Weight</Label>
                    <Select name="weight" required>
                      <SelectTrigger className="bg-black border-white/5 text-white h-14 rounded-2xl">
                        <SelectValue placeholder="Select Weight" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-white/10 text-white">
                        {['0.5kg', '1kg', '2kg', '3kg', 'Custom/Tiered'].map(w => (
                          <SelectItem key={w} value={w}>{w}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 text-left">
                    <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Message on Cake</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                      <Input name="message" className="pl-12 bg-black border-white/5 text-white h-14 rounded-2xl" placeholder="Happy Birthday..." />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <Label className="text-gray-400 text-xs font-bold uppercase tracking-widest ml-1">Design Notes</Label>
                  <Textarea name="notes" className="bg-black border-white/5 text-white rounded-2xl min-h-[120px] pt-4" placeholder="Briefly describe the theme or design you have in mind..." />
                </div>

                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black py-8 text-xl rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.15)] transition-all hover:scale-[1.01] active:scale-95 cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Request via WhatsApp"}
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}