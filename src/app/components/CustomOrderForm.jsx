import { useState } from 'react';
import { Upload, Calendar, MessageSquare, Loader2, User, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card } from './ui/card';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export function CustomOrderForm() {
  const [loading, setLoading] = useState(false);

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
    <section id="custom-orders" className="py-14 md:py-16 bg-gradient-to-b from-[#0F0F0F] via-[#0A0A0A] to-[#000000]">
      <div className="site-container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Request a Custom Creation</h2>
          <p className="text-gray-400">Your vision, our baking expertise</p>
        </div>

        <Card className="p-8 md:p-12 bg-[#141414] border border-white/10 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-gray-300">Your Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input name="customerName" required className="pl-10 bg-black/50 border-white/10 text-white h-14" placeholder="Ayyan Malim" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input name="phone" required type="tel" className="pl-10 bg-black/50 border-white/10 text-white h-14" placeholder="9876543210" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label className="text-gray-300">Message on Cake</Label>
                <Input name="message" className="bg-black/50 border-white/10 text-white h-14" placeholder="Happy Birthday!" />
              </div>

              {/* 🔥 UPDATED DATE INPUT */}
              <div className="space-y-2">
                <Label className="text-gray-300">Delivery Date</Label>
                <div className="relative group">
                  <Input
                    type="date"
                    name="date"
                    required
                    // removed min={today} to allow past dates
                    onClick={(e) => e.target.showPicker()}
                    className="bg-black/50 border-white/10 text-white h-14 w-full pr-10 cursor-pointer focus:border-[#D4AF37] transition-colors"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] pointer-events-none" size={18} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Flavor Preference</Label>
                <Select name="flavor" required>
                  <SelectTrigger className="bg-black/50 border-white/10 text-white h-14">
                    <SelectValue placeholder="Choose Flavor" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                    {['Chocolate', 'Vanilla', 'Red Velvet', 'Strawberry', 'Black Forest', 'Butterscotch', 'Custom Flavor'].map(f => (
                      <SelectItem key={f} value={f}>{f}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Approx. Weight</Label>
                <Select name="weight" required>
                  <SelectTrigger className="bg-black/50 border-white/10 text-white h-14">
                    <SelectValue placeholder="Weight" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-white/10 text-white">
                    {['0.5kg', '1kg', '2kg', '3kg', 'Custom/Tiered'].map(w => (
                      <SelectItem key={w} value={w}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Additional Instructions</Label>
              <Textarea name="notes" className="bg-black/50 border-white/10 text-white" rows={4} placeholder="Describe your dream cake..." />
            </div>

            <Button disabled={loading} type="submit" className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black py-8 text-xl rounded-2xl shadow-lg transition-all active:scale-95 cursor-pointer">
              {loading ? <Loader2 className="animate-spin" /> : "Send Request to WhatsApp"}
            </Button>
          </form>
        </Card>
      </div>
    </section>
  );
}