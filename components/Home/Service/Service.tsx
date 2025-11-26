import React from 'react';
import { FaLeaf, FaLaptopCode, FaStethoscope, FaFemale, FaUtensils, FaBook } from 'react-icons/fa';
import Link from 'next/link';

const Service = () => {
  const services = [
    {
      icon: FaLeaf,
      title: 'মাটির পুনর্জীবন',
      description:
        'রসায়নহীন, জৈব সার ও ফসলের আবর্তনের মাধ্যমে মাটির উর্বরতা ফিরিয়ে আনা এবং টেকসই চাষাবাদ গড়ে তোলা।',
    },
    {
      icon: FaLaptopCode,
      title: 'তরুণদের ডিজিটাল ভবিষ্যৎ',
      description:
        'ডিজিটাল প্রশিক্ষণ কেন্দ্রের মাধ্যমে তরুণদের ফ্রিল্যান্সিং, গ্রাফিক ডিজাইন ও অনলাইন দক্ষতায় স্বাবলম্বী করা।',
    },
    {
      icon: FaStethoscope,
      title: 'সবার জন্য স্বাস্থ্য',
      description:
        'স্বাস্থ্য অধিকার নিশ্চিত করতে নিয়মিত শিবির, বিনামূল্যে ওষুধ ও মা–শিশু সেবার উন্নয়ন।',
    },
    {
      icon: FaFemale,
      title: 'নারীর আর্থিক স্বাধীনতা',
      description:
        'ক্ষুদ্রঋণ, দক্ষতা উন্নয়ন ও বাজার সংযোগের মাধ্যমে নারী উদ্যোক্তা গড়ে তোলা।',
    },
    {
      icon: FaUtensils,
      title: 'খাদ্য সহায়তা ও মানবিক সেবা',
      description:
        'দরিদ্র ও সংকটে থাকা পরিবারদের নিয়মিত খাদ্য বিতরণ ও তাত্ক্ষণিক সহায়তা প্রদান।',
    },
    {
      icon: FaBook,
      title: 'শিক্ষা ও সামাজিক সচেতনতা',
      description:
        'মানসম্মত শিক্ষা, সচেতনতা কর্মশালা ও কমিউনিটি লাইব্রেরির মাধ্যমে জ্ঞানের প্রসার।',
    },
  ];

  return (
    <div className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          উম্মাহের স্বার্থে, সুন্নাহের সাথে
        </h2>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 text-center hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center">
                  <service.icon className="w-10 h-10 text-yellow-500" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Learn More Button */}
        <div className="flex justify-center">
          <Link
            href="/about"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            আরও জানুন
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Service;