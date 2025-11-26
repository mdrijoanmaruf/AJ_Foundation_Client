"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes } from "react-icons/fa";

interface TeamMember {
  _id: string;
  name: string;
  designation: string;
  photo: string;
  email?: string;
  phone?: string;
  bio?: string;
  role: 'team' | 'advisor';
  order: number;
  isActive: boolean;
}

const TeamAdmin = () => {
  const { data: session } = useSession();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    designation: "",
    photo: "",
    email: "",
    phone: "",
    bio: "",
    role: "team" as 'team' | 'advisor',
    order: 0,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const getAuthToken = () => {
    return (session as any)?.token || "";
  };

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
      Swal.fire("ত্রুটি!", "টিম সদস্য লোড করতে ব্যর্থ হয়েছে", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({ ...formData, photo: base64String });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.designation || !formData.photo) {
      Swal.fire("সতর্কতা!", "নাম, পদবী এবং ছবি আবশ্যক", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const url = editingMember
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/team/${editingMember._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/team`;

      const method = editingMember ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire(
          "সফল!",
          editingMember
            ? "টিম সদস্য সফলভাবে আপডেট হয়েছে"
            : "টিম সদস্য সফলভাবে যোগ করা হয়েছে",
          "success"
        );
        fetchTeamMembers();
        handleCloseModal();
      } else {
        Swal.fire("ত্রুটি!", data.message, "error");
      }
    } catch (error) {
      console.error("Error saving team member:", error);
      Swal.fire("ত্রুটি!", "কিছু ভুল হয়েছে", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      designation: member.designation,
      photo: member.photo,
      email: member.email || "",
      phone: member.phone || "",
      bio: member.bio || "",
      role: member.role || "team",
      order: member.order,
    });
    setImagePreview(member.photo);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই টিম সদস্যকে মুছে ফেলতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/team/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          Swal.fire("মুছে ফেলা হয়েছে!", "টিম সদস্য মুছে ফেলা হয়েছে", "success");
          fetchTeamMembers();
        } else {
          Swal.fire("ত্রুটি!", data.message, "error");
        }
      } catch (error) {
        console.error("Error deleting team member:", error);
        Swal.fire("ত্রুটি!", "কিছু ভুল হয়েছে", "error");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingMember(null);
    setFormData({
      name: "",
      designation: "",
      photo: "",
      email: "",
      phone: "",
      bio: "",
      role: "team",
      order: 0,
    });
    setImagePreview("");
  };

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">টিম ব্যবস্থাপনা</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <FaPlus />
          নতুন সদস্য যোগ করুন
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="নাম বা পদবী দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Team Members Grid */}
      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-green-600 text-sm mb-1">
                  {member.designation}
                </p>
                {member.role === 'advisor' && (
                  <span className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full mb-2">
                    উপদেষ্টা
                  </span>
                )}
                {member.email && (
                  <p className="text-gray-600 text-xs mb-1">📧 {member.email}</p>
                )}
                {member.phone && (
                  <p className="text-gray-600 text-xs mb-3">📞 {member.phone}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(member)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
                  >
                    <FaEdit />
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
                  >
                    <FaTrash />
                    মুছুন
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            {searchQuery
              ? "কোন টিম সদস্য পাওয়া যায়নি"
              : "এখনো কোন টিম সদস্য যোগ করা হয়নি"}
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-green-50 to-blue-50 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingMember ? "টিম সদস্য এডিট করুন" : "নতুন টিম সদস্য যোগ করুন"}
              </h2>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4" id="team-form">
                {/* Image Upload */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ছবি *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  {imagePreview && (
                    <div className="mt-4 relative h-48 w-48 mx-auto">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    নাম *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    পদবী *
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ইমেইল
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ফোন নম্বর
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    বিবরণ
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Role Checkbox */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.role === 'advisor'}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.checked ? 'advisor' : 'team' })
                      }
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                    />
                    <span className="text-gray-700 font-medium">
                      উপদেষ্টা হিসেবে চিহ্নিত করুন
                    </span>
                  </label>
                  <p className="text-sm text-gray-500 mt-1 ml-8">
                    এই সদস্যকে উপদেষ্টা হিসেবে দেখানো হবে
                  </p>
                </div>

                {/* Order */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ক্রম
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({ ...formData, order: parseInt(e.target.value) })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-all hover:shadow-md"
              >
                বাতিল
              </button>
              <button
                type="submit"
                form="team-form"
                disabled={isSubmitting}
                className={`flex-1 bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white inline-block mr-2"></span>
                    {editingMember ? 'আপডেট করা হচ্ছে...' : 'সংরক্ষণ করা হচ্ছে...'}
                  </span>
                ) : (
                  editingMember ? 'আপডেট করুন' : 'যোগ করুন'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamAdmin;