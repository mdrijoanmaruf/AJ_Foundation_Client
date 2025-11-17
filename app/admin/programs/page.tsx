"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaImage,
} from "react-icons/fa";

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
  order: number;
  isActive: boolean;
}

const ProgramsAdmin = () => {
  const { data: session } = useSession();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    photo: "",
    youtubeLink: "",
    objectives: [""],
    beneficiaries: [""],
    expenseCategories: [""],
    areas: [""],
    duration: "",
    amount: "",
    galleryImages: [] as string[],
    order: 0,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const getAuthToken = () => {
    return (session as any)?.token || "";
  };

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
      Swal.fire("ত্রুটি!", "প্রোগ্রাম লোড করতে ব্যর্থ হয়েছে", "error");
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

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const previews: string[] = [];
      const base64Images: string[] = [];

      fileArray.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          previews.push(base64String);
          base64Images.push(base64String);

          if (index === fileArray.length - 1) {
            setGalleryPreviews(previews);
            setFormData({ ...formData, galleryImages: base64Images });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const addArrayField = (field: "objectives" | "beneficiaries" | "expenseCategories" | "areas") => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    });
  };

  const removeArrayField = (
    field: "objectives" | "beneficiaries" | "expenseCategories" | "areas",
    index: number
  ) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const updateArrayField = (
    field: "objectives" | "beneficiaries" | "expenseCategories" | "areas",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [field]: newArray,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.photo) {
      Swal.fire("সতর্কতা!", "শিরোনাম, বিবরণ এবং ছবি আবশ্যক", "warning");
      return;
    }

    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      objectives: formData.objectives.filter((item) => item.trim() !== ""),
      beneficiaries: formData.beneficiaries.filter((item) => item.trim() !== ""),
      expenseCategories: formData.expenseCategories.filter((item) => item.trim() !== ""),
      areas: formData.areas.filter((item) => item.trim() !== ""),
    };

    setIsSubmitting(true);
    try {
      const url = editingProgram
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/programs/${editingProgram._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/programs`;

      const method = editingProgram ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire(
          "সফল!",
          editingProgram
            ? "প্রোগ্রাম সফলভাবে আপডেট হয়েছে"
            : "প্রোগ্রাম সফলভাবে যোগ করা হয়েছে",
          "success"
        );
        fetchPrograms();
        handleCloseModal();
      } else {
        Swal.fire("ত্রুটি!", data.message, "error");
      }
    } catch (error) {
      console.error("Error saving program:", error);
      Swal.fire("ত্রুটি!", "কিছু ভুল হয়েছে", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      title: program.title,
      description: program.description,
      photo: program.photo,
      youtubeLink: program.youtubeLink || "",
      objectives: program.objectives.length > 0 ? program.objectives : [""],
      beneficiaries: program.beneficiaries.length > 0 ? program.beneficiaries : [""],
      expenseCategories: program.expenseCategories.length > 0 ? program.expenseCategories : [""],
      areas: program.areas.length > 0 ? program.areas : [""],
      duration: program.duration || "",
      amount: program.amount || "",
      galleryImages: program.galleryImages || [],
      order: program.order,
    });
    setImagePreview(program.photo);
    setGalleryPreviews(program.galleryImages || []);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই প্রোগ্রাম মুছে ফেলতে চান?",
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/programs/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          Swal.fire("মুছে ফেলা হয়েছে!", "প্রোগ্রাম মুছে ফেলা হয়েছে", "success");
          fetchPrograms();
        } else {
          Swal.fire("ত্রুটি!", data.message, "error");
        }
      } catch (error) {
        console.error("Error deleting program:", error);
        Swal.fire("ত্রুটি!", "কিছু ভুল হয়েছে", "error");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProgram(null);
    setFormData({
      title: "",
      description: "",
      photo: "",
      youtubeLink: "",
      objectives: [""],
      beneficiaries: [""],
      expenseCategories: [""],
      areas: [""],
      duration: "",
      amount: "",
      galleryImages: [],
      order: 0,
    });
    setImagePreview("");
    setGalleryPreviews([]);
  };

  const filteredPrograms = programs.filter((program) =>
    program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    program.description.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-3xl font-bold text-gray-900">প্রোগ্রাম ব্যবস্থাপনা</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <FaPlus />
          নতুন প্রোগ্রাম যোগ করুন
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="শিরোনাম বা বিবরণ দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <div
              key={program._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <Image
                  src={program.photo}
                  alt={program.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                  {program.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {program.description}
                </p>
                {program.amount && (
                  <p className="text-green-600 font-semibold mb-3">
                    পরিমাণ: {program.amount}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(program)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded flex items-center justify-center gap-2 transition-colors"
                  >
                    <FaEdit />
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(program._id)}
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
              ? "কোন প্রোগ্রাম পাওয়া যায়নি"
              : "এখনো কোন প্রোগ্রাম যোগ করা হয়নি"}
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-5xl w-full shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="px-8 py-6 border-b border-gray-200 bg-linear-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingProgram ? "প্রোগ্রাম এডিট করুন" : "নতুন প্রোগ্রাম যোগ করুন"}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-full"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <form onSubmit={handleSubmit} className="space-y-8" id="program-form">
                {/* Basic Information Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                    মৌলিক তথ্য
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        শিরোনাম <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="প্রোগ্রামের শিরোনাম লিখুন"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        required
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        বিবরণ <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        rows={5}
                        placeholder="প্রোগ্রামের বিস্তারিত বিবরণ লিখুন"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Media Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                    মিডিয়া ও ছবি
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Main Photo */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        প্রধান ছবি <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-green-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
                        />
                        {imagePreview && (
                          <div className="mt-4 relative h-56 w-full rounded-lg overflow-hidden shadow-md">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* YouTube Link */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        ইউটিউব ভিডিও লিংক (ঐচ্ছিক)
                      </label>
                      <input
                        type="url"
                        value={formData.youtubeLink}
                        onChange={(e) =>
                          setFormData({ ...formData, youtubeLink: e.target.value })
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      />
                    </div>

                    {/* Gallery Images */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        গ্যালারি ছবি (একাধিক)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryImagesChange}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        />
                        {galleryPreviews.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                            {galleryPreviews.map((preview, index) => (
                              <div key={index} className="relative h-28 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                <Image
                                  src={preview}
                                  alt={`Gallery ${index + 1}`}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Project Details Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                    প্রকল্পের বিস্তারিত
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Objectives */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-3 text-sm">
                        প্রকল্পের লক্ষ্য-উদ্দেশ্য
                      </label>
                      <div className="space-y-2">
                        {formData.objectives.map((objective, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex items-center justify-center w-8 h-10 bg-purple-100 text-purple-600 rounded-lg font-semibold text-sm shrink-0">
                              {index + 1}
                            </div>
                            <input
                              type="text"
                              value={objective}
                              onChange={(e) =>
                                updateArrayField("objectives", index, e.target.value)
                              }
                              placeholder={`উদ্দেশ্য ${index + 1}`}
                              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            />
                            {formData.objectives.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayField("objectives", index)}
                                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shrink-0"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addArrayField("objectives")}
                        className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <FaPlus /> উদ্দেশ্য যোগ করুন
                      </button>
                    </div>

                    {/* Beneficiaries */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-3 text-sm">
                        উপকারভোগী
                      </label>
                      <div className="space-y-2">
                        {formData.beneficiaries.map((beneficiary, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex items-center justify-center w-8 h-10 bg-green-100 text-green-600 rounded-lg font-semibold text-sm shrink-0">
                              {index + 1}
                            </div>
                            <input
                              type="text"
                              value={beneficiary}
                              onChange={(e) =>
                                updateArrayField("beneficiaries", index, e.target.value)
                              }
                              placeholder={`উপকারভোগী ${index + 1}`}
                              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                            />
                            {formData.beneficiaries.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayField("beneficiaries", index)}
                                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shrink-0"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addArrayField("beneficiaries")}
                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <FaPlus /> উপকারভোগী যোগ করুন
                      </button>
                    </div>

                    {/* Expense Categories */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-3 text-sm">
                        ব্যয়ের খাত
                      </label>
                      <div className="space-y-2">
                        {formData.expenseCategories.map((category, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex items-center justify-center w-8 h-10 bg-orange-100 text-orange-600 rounded-lg font-semibold text-sm shrink-0">
                              {index + 1}
                            </div>
                            <input
                              type="text"
                              value={category}
                              onChange={(e) =>
                                updateArrayField("expenseCategories", index, e.target.value)
                              }
                              placeholder={`খাত ${index + 1}`}
                              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            />
                            {formData.expenseCategories.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayField("expenseCategories", index)}
                                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shrink-0"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addArrayField("expenseCategories")}
                        className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <FaPlus /> খাত যোগ করুন
                      </button>
                    </div>

                    {/* Areas */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-3 text-sm">
                        প্রকল্পের এলাকা
                      </label>
                      <div className="space-y-2">
                        {formData.areas.map((area, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="flex items-center justify-center w-8 h-10 bg-blue-100 text-blue-600 rounded-lg font-semibold text-sm shrink-0">
                              {index + 1}
                            </div>
                            <input
                              type="text"
                              value={area}
                              onChange={(e) =>
                                updateArrayField("areas", index, e.target.value)
                              }
                              placeholder={`এলাকা ${index + 1}`}
                              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                            {formData.areas.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeArrayField("areas", index)}
                                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shrink-0"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => addArrayField("areas")}
                        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
                      >
                        <FaPlus /> এলাকা যোগ করুন
                      </button>
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                    অতিরিক্ত তথ্য
                  </h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Duration */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        মেয়াদ
                      </label>
                      <input
                        type="text"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        placeholder="যেমন: ৬ মাস, ১ বছর"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    
                    {/* Amount */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        পরিমাণ
                      </label>
                      <input
                        type="text"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        placeholder="যেমন: ৫০,০০০ টাকা"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    {/* Order */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2 text-sm">
                        ক্রম
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
                        }
                        placeholder="0"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer - Fixed */}
            <div className="px-8 py-4 border-t border-gray-200 bg-gray-50 flex gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-all hover:shadow-md"
              >
                বাতিল করুন
              </button>
              <button
                type="submit"
                form="program-form"
                disabled={isSubmitting}
                className={`flex-1 bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white inline-block mr-2"></span>
                    {editingProgram ? 'আপডেট করা হচ্ছে...' : 'সংরক্ষণ করা হচ্ছে...'}
                  </span>
                ) : (
                  editingProgram ? '✓ আপডেট করুন' : '✓ সংরক্ষণ করুন'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramsAdmin;