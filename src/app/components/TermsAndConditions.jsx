import React from 'react';

export default function TermsAndConditions() {
    return (
        <div className="bg-[#0A0A0A] text-gray-300 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-4xl font-black text-white">Terms & Conditions</h1>
                <p className="text-sm text-[#D4AF37]">Last Updated: February 2026</p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">1. Ordering & Cutoff Times</h2>
                    <p>Standard cake orders must be placed before 6:00 PM for next-day delivery. Custom designs require at least 24-48 hours notice depending on complexity.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">2. Pure Veg Guarantee</h2>
                    <p>All products at Naazie's Eats & Treats are 100% Pure Vegetarian, prepared in a egg-free environment.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">3. Cancellations & Refunds</h2>
                    <p>Cancellations made within 24 hours of the delivery time are not eligible for a refund due to the perishable nature of our products.</p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">4. Delivery</h2>
                    <p>We currently deliver across Mumbai and Mumbra. Delivery charges may apply based on your specific location.</p>
                </section>
            </div>
        </div>
    );
}