import { motion } from 'framer-motion';
import { UtensilsCrossed, ArrowLeft, Instagram, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';

export default function ComingSoon() {
    const goBack = () => {
        window.history.back();
    };

    const handleWhatsApp = () => {
        const message = 'Hi! I saw your coming soon page and wanted to inquire about your cakes.';
        window.open(`https://wa.me/917304382291?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden px-6">

            {/* Dynamic Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/10 blur-[120px] rounded-full animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#8B5A3C]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="max-w-3xl w-full relative z-10 text-center">

                {/* Animated Icon Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 inline-block"
                >
                    <div className="relative">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl relative z-10">
                            <UtensilsCrossed className="h-12 w-12 md:h-16 md:w-16 text-[#D4AF37]" />
                        </div>
                        {/* Outer Glow */}
                        <div className="absolute inset-0 bg-[#D4AF37]/20 blur-2xl rounded-full scale-110 animate-pulse"></div>
                    </div>
                </motion.div>

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="space-y-6"
                >
                    <span className="text-[#D4AF37] text-xs md:text-sm tracking-[0.4em] uppercase font-bold">
                        Something Sweet is Brewing
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                        Coming <span className="italic font-serif text-[#D4AF37]">Soon</span>
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                        We are currently fine-tuning this page to bring you the best experience.
                        Our digital bakery is almost ready to serve!
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Button
                        onClick={goBack}
                        variant="outline"
                        className="w-full sm:w-auto border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-full px-8 py-6 text-lg transition-all duration-300 flex items-center gap-2 hover:cursor-pointer"
                    >
                        <span className='ml-1'><ArrowLeft size={18} /></span> <span className="mr-1">Go Back</span>
                    </Button>

                    <Button
                        onClick={handleWhatsApp}
                        className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-[#D4AF37]/20 transition-all duration-300 flex items-center gap-2 hover:cursor-pointer"
                    >
                        <span className='ml-1'><MessageCircle size={18} /></span> <span className="mr-1">Inquire Now</span>
                    </Button>
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-16 pt-8 border-t border-white/5"
                >
                    <p className="text-gray-500 text-sm mb-4">Follow our journey on Instagram</p>
                    <a
                        href="https://www.instagram.com/naazies986?igsh=aHhraTN0eGppaG41"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-[#D4AF37] transition-colors"
                    >
                        <Instagram size={20} />
                        <span className="font-medium tracking-wide">@naazies986</span>
                    </a>
                </motion.div>

            </div>

            {/* Decorative Brand Text (Large Background) */}
            <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.02]">
                <h2 className="text-[20vw] font-black text-white whitespace-nowrap">NAAZIE'S</h2>
            </div>
        </div>
    );
}