"use client";
import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & description */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center"> 
                {/* simple mark */}
                <span className="text-green-200 font-bold">AS</span>
              </div>
              <div>
                <div className="text-lg font-bold">AS-SUNNAH</div>
                <div className="text-sm text-emerald-200">Foundation</div>
              </div>
            </div>

            <p className="text-sm text-emerald-200/90">
              আস‑সুন্নাহ ফাউন্ডেশন মানবতাবাদী শিক্ষা, দাওয়াহ ও সামাজিক কল্যাণে
              নিবেদিত একটি অলাভজনক প্রতিষ্ঠান; আমরা সম্প্রদায় ভিত্তিক প্রকল্প
              এবং জরুরী সহায়তা প্রদান করে থাকি।
            </p>

            <div className="flex items-center gap-3">
              <a href="#" aria-label="facebook" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 10-11.5 9.9v-7H8v-3h2.5V9.3c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6v1.9H18l-.4 3h-2.6v7A10 10 0 0022 12z"/></svg>
              </a>
              <a href="#" aria-label="youtube" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C16.7 2.4 12 2.4 12 2.4h-.1s-4.7 0-8.6.5c-.4 0-1.3 0-2.1 1C.7 4.6.5 6.2.5 6.2S0 8 0 9.8v.4c0 1.8.5 3.6.5 3.6s.2 1.6.8 2.3c.8.9 1.9.9 2.4 1 1.8.1 7.6.5 7.6.5s4.7 0 8.6-.5c.4 0 1.3 0 2.1-1 .6-.7.8-2.3.8-2.3s.5-1.8.5-3.6v-.4c0-1.8-.5-3.6-.5-3.6zM10 15V7l6 4-6 4z"/></svg>
              </a>
              <a href="#" aria-label="linkedin" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 11.02 0zM3 8.98h4v12H3zM9 8.98h3.8v1.7h.1c.5-.9 1.8-1.8 3.7-1.8 4 0 4.7 2.7 4.7 6.2v7.9H19v-7.1c0-1.7 0-3.9-2.4-3.9-2.4 0-2.8 1.9-2.8 3.8v7.2H9z"/></svg>
              </a>
            </div>
          </div>

          {/* Menu columns */}
          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-md font-semibold mb-3">মেনু</h3>
            <ul className="space-y-2 text-emerald-200 text-center md:text-center">
              <li>
                <Link href="/about" className="hover:text-white">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/programs" className="hover:text-white">
                  কার্যক্রমসমূহ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  ব্লগ
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-white">
                  গ্যালারি
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-end md:text-right">
            <h3 className="text-md font-semibold mb-3">যোগ দিতে</h3>
            <ul className="space-y-2 text-emerald-200">
              <li>
                <Link href="/donate" className="hover:text-white">
                  দান করুন
                </Link>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-white">
                  স্বেচ্ছাসেবক
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  যোগাযোগ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-sm text-emerald-200/90">
                © {new Date().getFullYear()} আস‑সুন্নাহ ফাউন্ডেশন — সর্ব স্বত্ব সংরক্ষিত।
              </p>
            </div>

            {/* Developer Credit */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-emerald-200/70">Developed by</span>
              
              <a 
                href="https://rijoan.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium hover:text-emerald-300 transition-colors duration-200 flex items-center gap-1 group"
              >
                MD Rijoan Maruf
                <svg 
                  className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;