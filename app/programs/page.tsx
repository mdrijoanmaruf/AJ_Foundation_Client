"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TitleBg from "../../components/Contact/TitleBg";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

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

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/programs`
      );
      const data = await response.json();
      if (data.success) {
        setPrograms(data.data);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <TitleBg
        title="আমাদের কার্যক্রম"
        subtitle={
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            সমাজের উন্নয়নে আমাদের বিভিন্ন কার্যক্রম এবং প্রকল্প সমূহ
          </p>
        }
      />

      {/* Programs Section */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
          </div>
        ) : programs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {programs.map((program) => (
              <div
                key={program._id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                {/* Program Image */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={program.photo}
                    alt={program.title}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <FaCalendarAlt className="text-xs" />
                    নিয়মিত কার্যক্রম
                  </div>
                </div>

                {/* Program Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {program.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {program.description}
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

                  {/* View Details Button */}
                  <Link
                    href={`/programs/${program._id}`}
                    className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors border border-green-600"
                  >
                    বিস্তারিত দেখুন
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">কোন কার্যক্রম পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Programs;