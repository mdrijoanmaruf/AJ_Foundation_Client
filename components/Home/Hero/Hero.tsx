import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
  <section className="relative min-h-[520px] lg:min-h-[640px] w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        {/* Dark overlay gradient - stronger on left */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-[600px] lg:min-h-[700px] flex items-center">
        <div className="max-w-2xl py-16">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            এ/জে খান ফাউন্ডেশন
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-white/85 mb-6 leading-relaxed">
            আস-সুন্নাহ ফাউন্ডেশন একটি অরাজৈনতিক, অলাভজনক শিক্ষা, দাওয়াহ ও পূর্ণতা
            মানবকল্যাণে নিবেদিত সেবামূলক সরকার-নিরপেক্ষ প্রতিষ্ঠান। নিবন্ধন নম্বর:
            এস-১৩১১১/২০১৯।
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow"
            >
              আরও জানুন
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white border-2 border-white/80 hover:bg-white/10 rounded-lg transition-colors"
            >
              কার্যক্রমসমূহ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;