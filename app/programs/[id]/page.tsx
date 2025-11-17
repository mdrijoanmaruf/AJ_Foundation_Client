"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { FaCheckCircle, FaUsers, FaMapMarkerAlt, FaCalendar } from "react-icons/fa";
import TitleBg from "@/components/Contact/TitleBg";

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
}

const ProgramDetails = () => {
  const params = useParams();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/programs/${params.id}`
        );
        const data = await response.json();
        if (data.success) {
          setProgram(data.data);
        }
      } catch (error) {
        console.error("Error fetching program:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProgram();
    }
  }, [params.id]);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    )?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            প্রোগ্রাম পাওয়া যায়নি
          </h2>
          <p className="text-gray-600">
            দুঃখিত, এই প্রোগ্রামটি খুঁজে পাওয়া যায়নি।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <TitleBg title={program.title} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Main Program Image - Show at top only if NO YouTube video */}
              {(!program.youtubeLink || !getYouTubeEmbedUrl(program.youtubeLink || '')) && (
                <div className="relative h-96 w-full">
                  <Image
                    src={program.photo}
                    alt={program.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  {program.amount && (
                    <div className="absolute bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg">
                      <p className="text-sm font-medium">পরিমাণ</p>
                      <p className="text-xl font-bold">{program.amount}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="p-6 lg:p-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 border-b-4 border-green-600 pb-3 inline-block">
                  কার্যক্রমের বিবরণ
                </h3>

                {/* YouTube Video */}
                {program.youtubeLink && getYouTubeEmbedUrl(program.youtubeLink) && (
                  <div className="my-8 rounded-xl overflow-hidden shadow-2xl border-4 border-gray-100">
                    <iframe
                      className="w-full aspect-video"
                      src={getYouTubeEmbedUrl(program.youtubeLink) || ""}
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                )}

                {/* Description */}
                <div className="prose max-w-none mt-6">
                  <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                    {program.description}
                  </p>
                </div>
              </div>

              {/* Gallery Images - Include main photo if video exists */}
              {(program.galleryImages && program.galleryImages.length > 0) || (program.youtubeLink && getYouTubeEmbedUrl(program.youtubeLink)) ? (
                <div className="mt-10 p-6 lg:p-8 bg-gray-50 rounded-xl">
                  <h4 className="text-2xl font-bold text-gray-900 mb-6 border-b-4 border-green-600 pb-3 inline-block">
                    ছবি গ্যালারি
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                    {/* Show main photo first if video exists */}
                    {program.youtubeLink && getYouTubeEmbedUrl(program.youtubeLink) && (
                      <div className="relative h-56 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200">
                        <Image
                          src={program.photo}
                          alt={program.title}
                          fill
                          className="object-cover"
                        />
                        {program.amount && (
                          <div className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-1.5 rounded-md shadow-lg">
                            <p className="text-xs font-medium">পরিমাণ</p>
                            <p className="text-sm font-bold">{program.amount}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Other gallery images */}
                    {program.galleryImages && program.galleryImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-56 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-200"
                      >
                        <Image
                          src={image}
                          alt={`${program.title} - ছবি ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="space-y-6">
              {/* Objectives */}
              {program.objectives && program.objectives.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg p-6 border-l-4 border-green-600">
                  <h5 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-600 rounded"></span>
                    প্রকল্পের লক্ষ্য-উদ্দেশ্য
                  </h5>
                  <div className="space-y-3">
                    {program.objectives.map((objective, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FaCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 text-sm">{objective}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Beneficiaries */}
              {program.beneficiaries && program.beneficiaries.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 border-l-4 border-blue-600">
                  <h5 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-600 rounded"></span>
                    উপকারভোগী
                  </h5>
                  <div className="space-y-3">
                    {program.beneficiaries.map((beneficiary, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FaUsers className="text-blue-600 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 text-sm">{beneficiary}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expense Categories */}
              {program.expenseCategories && program.expenseCategories.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl shadow-lg p-6 border-l-4 border-orange-600">
                  <h5 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-2 h-8 bg-orange-600 rounded"></span>
                    ব্যয়ের খাত
                  </h5>
                  <div className="space-y-3">
                    {program.expenseCategories.map((category, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FaCheckCircle className="text-orange-600 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 text-sm">{category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Areas */}
              {program.areas && program.areas.length > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg p-6 border-l-4 border-purple-600">
                  <h5 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-2 h-8 bg-purple-600 rounded"></span>
                    প্রকল্পের এলাকা
                  </h5>
                  <div className="space-y-3">
                    {program.areas.map((area, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <FaMapMarkerAlt className="text-purple-600 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 text-sm">{area}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration */}
              {program.duration && (
                <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-600">
                  <h5 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <span className="w-2 h-8 bg-indigo-600 rounded"></span>
                    মেয়াদ
                  </h5>
                  <div className="flex items-start gap-3">
                    <FaCalendar className="text-indigo-600 mt-1 flex-shrink-0" />
                    <p className="text-gray-700 text-sm">{program.duration}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramDetails;