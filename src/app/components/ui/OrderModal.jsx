import React, { useState, useMemo } from 'react';
import { X, Calendar, User, Phone, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import toast from 'react-hot-toast';
import api from '../../../lib/api';

export function OrderModal({ isOpen, onClose, cake }) {
    if (!cake) return null;

    // --- Logic to Disable Past Dates & Apply 6:00 PM Cutoff ---
    const minDateString = useMemo(() => {
        const now = new Date();
        const currentHour = now.getHours();

        // If it's after 6:00 PM (18:00), the earliest delivery is tomorrow
        if (currentHour >= 18) {
            now.setDate(now.getDate() + 1);
        }

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, [isOpen]);

    // --- SEO Schema for Order Action ---
    const orderSchema = {
        "@context": "https://schema.org",
        "@type": "OrderAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": `https://wa.me/917304382291?text=Order:${cake.name}`,
            "actionPlatform": [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform"
            ]
        },
        "object": {
            "@type": "Product",
            "name": cake.name,
            "image": cake.image || "https://naazieseatsntreats.vercel.app/logo3.png",
            "offers": {
                "@type": "Offer",
                "price": cake.price || 0,
                "priceCurrency": "INR"
            }
        }
    };

    const [formData, setFormData] = useState({ customerName: '', phone: '', deliveryDate: '', notes: '' });
    const [loading, setLoading] = useState(false);

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) setFormData({ ...formData, phone: value });
    };

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleWhatsAppOrder = async (e) => {
        e.preventDefault();
        if (formData.phone.length !== 10) return toast.error("Please enter a valid 10-digit number.");

        setLoading(true);
        try {
            const finalPrice = cake.price || 0;
            await api.post('/admin/orders/create', {
                productId: cake._id,
                customerName: formData.customerName,
                phone: formData.phone,
                cakeFlavor: cake.category || "General",
                cakeWeight: cake.size || "1kg",
                cakeMessage: formData.notes || "None",
                deliveryDate: formData.deliveryDate,
                totalPrice: finalPrice
            });

            const message = `*New Order from Naazie's Website*%0A%0A` +
                `*Cake:* ${cake.name}%0A` +
                `*Price:* ₹${finalPrice}%0A` +
                `*Customer:* ${formData.customerName}%0A` +
                `*Phone:* ${formData.phone}%0A` +
                `*Delivery Date:* ${formData.deliveryDate}%0A` +
                `*Notes:* ${formData.notes || 'None'}`;

            window.open(`https://wa.me/917304382291?text=${message}`, '_blank');
            toast.success("Order logged!");
            onClose();
        } catch (error) {
            toast.error("Process failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
                    {/* SEO Script Injection */}
                    <script type="application/ld+json">{JSON.stringify(orderSchema)}</script>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-lg bg-[#141414] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-[#D4AF37]/10 to-transparent">
                            <div>
                                <h2 className="text-xl font-bold text-white">Complete Your Order</h2>
                                <p className="text-[#D4AF37] text-sm font-medium">{cake.name}</p>
                            </div>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleWhatsAppOrder} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <Input name="customerName" required value={formData.customerName} onChange={handleChange} className="pl-10 bg-black border-white/5 text-white h-12 rounded-xl" placeholder="Ayyan Malim" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <Input name="phone" required type="tel" value={formData.phone} onChange={handlePhoneChange} className="pl-10 bg-black border-white/5 text-white h-12 rounded-xl" placeholder="9876543210" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Delivery Date</Label>
                                <div className="relative group">
                                    <Input name="deliveryDate" required type="date" min={minDateString} value={formData.deliveryDate} onChange={handleChange} onClick={(e) => e.target.showPicker()} className="bg-black border-white/5 text-white h-12 w-full pr-10 cursor-pointer focus:border-[#D4AF37]/50 rounded-xl" />
                                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-[#D4AF37] pointer-events-none" size={18} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-gray-400">Special Instructions / Message</Label>
                                <Textarea name="notes" value={formData.notes} onChange={handleChange} className="bg-black border-white/5 text-white min-h-[100px] rounded-xl" placeholder="Any special message on the cake or instructions..." />
                            </div>
                            <Button disabled={loading} type="submit" className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-black font-black py-7 rounded-2xl text-lg flex items-center justify-center gap-2 transition-all">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                {loading ? "Processing..." : "Send Order to WhatsApp"}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}