import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="bg-[#0A0A0A] text-gray-300 py-20 px-6 selection:bg-[#D4AF37] selection:text-black">
            <div className="max-w-4xl mx-auto space-y-10">
                <header className="space-y-4 border-b border-white/10 pb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white">Privacy Policy</h1>
                    <p className="text-sm text-[#D4AF37] font-medium tracking-widest uppercase">
                        Effective Date: February 2026
                    </p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
                    <p className="leading-relaxed">
                        At <strong>Naazie's Eats & Treats</strong>, we value the trust you place in us when ordering our handcrafted
                        Pure Veg cakes. This policy describes how we collect, use, and protect your personal information
                        to ensure a seamless experience across Mumbai and Mumbra.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
                    <p className="leading-relaxed">
                        When you place a custom order or use our contact forms, we collect the following details:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-[#D4AF37]">
                        <li><strong>Personal Identity:</strong> Your full name for order identification.</li>
                        <li><strong>Contact Details:</strong> Your WhatsApp number or phone number for order coordination.</li>
                        <li><strong>Logistics:</strong> Your delivery address within Mumbai or Mumbra.</li>
                        <li><strong>Preferences:</strong> Cake flavors, designs, and special messages provided for customization.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">3. How We Use Your Data</h2>
                    <p className="leading-relaxed">Your data is strictly used for operational purposes:</p>
                    <ul className="list-disc pl-6 space-y-2 marker:text-[#D4AF37]">
                        <li>To confirm, process, and deliver your Pure Veg cake orders.</li>
                        <li>To share real-time updates regarding your delivery status via WhatsApp.</li>
                        <li>To understand website traffic patterns and improve our menu offerings.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">4. Data Sharing & Third Parties</h2>
                    <p className="leading-relaxed">
                        We do not sell or rent your personal data to third parties. We only share information with
                        necessary service providers, such as delivery partners, solely to fulfill your specific order.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">5. Your Rights</h2>
                    <p className="leading-relaxed">
                        You have the right to request access to the personal data we hold about you or ask for its
                        deletion once your order has been successfully fulfilled. For any privacy-related
                        concerns, please contact us at <strong>naazies.eatsntreats@gmail.com</strong>.
                    </p>
                </section>

                <footer className="pt-10 border-t border-white/10">
                    <p className="text-sm text-gray-500 italic text-center">
                        © {new Date().getFullYear()} Naazie's Eats & Treats. Handcrafted with care in Mumbai.
                    </p>
                </footer>
            </div>
        </div>
    );
}