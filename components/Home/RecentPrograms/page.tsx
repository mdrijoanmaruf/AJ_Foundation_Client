"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Program {
  _id: string;
  title: string;
  description: string;
  photo: string;
  youtubeLink?: string;
  objectives: string[];
  beneficiaries: string[];
  expenseCategories: string[];
  areas: string[];
  duration?: string;
  amount?: string;
  galleryImages: string[];
  createdAt: string;
}

const RecentPrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPrograms();
  }, []);

  const fetchRecentPrograms = async () => {
    try {
      const response = await fetch(`${API_URL}/api/programs?limit=3`);
      const data = await response.json();
      if (data.success) {
        setPrograms(data.data);
      }
    } catch (error) {
      console.error("Error fetching recent programs:", error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (programs.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            সাম্প্রতিক কার্যক্রম
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            সমাজের উন্নয়নে আমাদের সর্বশেষ কার্যক্রম এবং প্রকল্প সমূহ
          </p>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {programs.map((program) => (
            <Link
              key={program._id}
              href={`/programs/${program._id}`}
              className="group"
            >
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col border border-gray-100">
                {/* Program Image */}
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  <Image
                    src={program.photo}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                    <FaCalendarAlt className="text-xs" />
                    নিয়মিত কার্যক্রম
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2 leading-tight">
                    {program.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
                    {truncateText(program.description, 120)}
                  </p>

                  {/* Additional Info */}
                  <div className="space-y-2 mb-4">
                    {program.areas && program.areas.length > 0 && (
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <FaMapMarkerAlt className="text-green-600 mt-1 shrink-0" />
                        <span className="line-clamp-1">
                          {program.areas.join(", ")}
                        </span>
                      </div>
                    )}

                    {program.duration && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaCalendarAlt className="text-green-600" />
                        <span>মেয়াদ: {program.duration}</span>
                      </div>
                    )}

                    {program.amount && (
                      <div className="text-sm text-gray-900 font-semibold">
                        পরিমাণ: {program.amount}
                      </div>
                    )}
                  </div>

                  {/* View Details Link */}
                  <div className="pt-4 border-t border-gray-100">
                    <span className="text-green-600 font-semibold text-sm group-hover:text-green-700 flex items-center gap-2">
                      বিস্তারিত দেখুন
                      <svg
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Link
            href="/programs"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            সকল কার্যক্রম দেখুন
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
    </section>
  );
};

export default RecentPrograms;