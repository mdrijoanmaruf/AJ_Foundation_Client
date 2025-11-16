"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaEnvelope, FaPhone } from "react-icons/fa";

interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  photo: string;
  email?: string;
  phone?: string;
  bio?: string;
}

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/team`
      );
      const data = await response.json();
      if (data.success) {
        setTeamMembers(data.data);
      }
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            আমাদের সম্পর্কে
          </h1>
          <p className="text-lg md:text-xl text-center max-w-3xl mx-auto opacity-90">
            এজে খান ফাউন্ডেশন একটি অলাভজনক সংস্থা যা শিক্ষা, সেবা এবং দাওয়াহর
            মাধ্যমে সমাজের উন্নয়নে কাজ করছে
          </p>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Mission */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-green-600">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              আমাদের লক্ষ্য
            </h2>
            <p className="text-gray-700 leading-relaxed">
              এজে খান ফাউন্ডেশনের মূল লক্ষ্য হলো সমাজের সকল স্তরের মানুষের জীবনমান
              উন্নত করা। আমরা বিশ্বাস করি যে শিক্ষা, স্বাস্থ্যসেবা এবং নৈতিক
              উন্নয়নের মাধ্যমে একটি উন্নত সমাজ গড়ে তোলা সম্ভব। আমাদের প্রতিটি
              কার্যক্রম পরিচালিত হয় মানবসেবা এবং সামাজিক দায়বদ্ধতার মূলমন্ত্রে।
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-t-4 border-blue-600">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              আমাদের দৃষ্টিভঙ্গি
            </h2>
            <p className="text-gray-700 leading-relaxed">
              আমরা এমন একটি সমাজ গড়তে চাই যেখানে প্রতিটি মানুষ শিক্ষা, স্বাস্থ্য
              এবং মৌলিক অধিকার পাবে। আমাদের দৃষ্টিভঙ্গি হলো একটি সমৃদ্ধ,
              শিক্ষিত এবং নৈতিকভাবে সচেতন সমাজ প্রতিষ্ঠা করা যেখানে কেউ পিছিয়ে
              থাকবে না।
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            আমাদের মূল্যবোধ
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">সততা</h3>
              <p className="text-gray-600">
                আমরা সকল কাজে সততা এবং স্বচ্ছতা বজায় রাখি
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">সেবা</h3>
              <p className="text-gray-600">
                মানবসেবা আমাদের প্রধান উদ্দেশ্য এবং অঙ্গীকার
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                দায়বদ্ধতা
              </h3>
              <p className="text-gray-600">
                সমাজের প্রতি আমাদের দায়বদ্ধতা সর্বোচ্চ অগ্রাধিকার
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            আমাদের টিম
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            আমাদের দক্ষ এবং নিবেদিত টিম সদস্যরা নিরলসভাবে কাজ করে যাচ্ছেন
            ফাউন্ডেশনের লক্ষ্য অর্জনের জন্য
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
          </div>
        ) : teamMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member) => (
              <div
                key={member._id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.photo}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-medium mb-4">
                    {member.designation}
                  </p>
                  {member.bio && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {member.bio}
                    </p>
                  )}
                  <div className="flex flex-col gap-2">
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600 text-sm transition-colors"
                      >
                        <FaEnvelope className="text-green-600" />
                        {member.email}
                      </a>
                    )}
                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-600 text-sm transition-colors"
                      >
                        <FaPhone className="text-green-600" />
                        {member.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">কোন টিম সদস্য পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;