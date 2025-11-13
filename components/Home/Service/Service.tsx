import React from 'react';
import { PiGraduationCapFill } from 'react-icons/pi';
import { FaHandsHelping, FaHandHoldingHeart } from 'react-icons/fa';
import Link from 'next/link';

const Service = () => {
  const services = [
    {
      icon: PiGraduationCapFill,
      title: 'শিক্ষা',
      description:
        'জ্ঞান ও সাধারণ শিক্ষার সমর্থন সিরোবাকের মাদ্রাসা প্রতিষ্ঠা; স্কুল, কলেজ ও বিশ্ববিদ্যালয়সহ বিভিন্ন সাধারণ ও ক্যারিয়ার বিনোদালয় প্রতিষ্ঠা; এবং্ছা অত্যাপ্রতিদিনিক শিক্ষার উদোলো গ্রহণ',
    },
    {
      icon: FaHandsHelping,
      title: 'সেবা',
      description:
        'দরিদ্রদের স্বাবলম্বীকরণ, বয়স্কদের চাথ ও পরিবারকৃত, দরকৃত ও শান্তি শোকান্তায় সাহায্য; বৃক্ষরোপণ, শীতকের বিতরণ, ইফতার বিতরণ, সংবার জন্য কুরবানীসহ বিভিন্ন সেবামূলক কার্যক্রম',
    },
    {
      icon: FaHandHoldingHeart,
      title: 'দাওয়াহ',
      description:
        'ইই-পুস্তক রচনা ও প্রকাশনা, মসজিদ ও অভিত্যিরিয়াশক্তির ক্যাস্পী হালাকাহ, লাওয়াহ বিষয়ক প্রশিক্ষণ ও কর্মশালাসহ অসেলইসলামিক বহুমুখীক কার্যক্রম',
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