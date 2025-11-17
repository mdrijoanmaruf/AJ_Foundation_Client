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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8">
            <div className="p-6 max-h-[85vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 sticky top-0 bg-white pb-4 border-b">
                {editingProgram ? "প্রোগ্রাম এডিট করুন" : "নতুন প্রোগ্রাম যোগ করুন"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    শিরোনাম *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    বিবরণ *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Main Photo */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    প্রধান ছবি *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  {imagePreview && (
                    <div className="mt-4 relative h-48 w-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                {/* YouTube Link */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ইউটিউব ভিডিও লিংক (ঐচ্ছিক)
                  </label>
                  <input
                    type="url"
                    value={formData.youtubeLink}
                    onChange={(e) =>
                      setFormData({ ...formData, youtubeLink: e.target.value })
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Objectives */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    প্রকল্পের লক্ষ্য-উদ্দেশ্য
                  </label>
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) =>
                          updateArrayField("objectives", index, e.target.value)
                        }
                        placeholder={`উদ্দেশ্য ${index + 1}`}
                        className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField("objectives", index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField("objectives")}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <FaPlus /> উদ্দেশ্য যোগ করুন
                  </button>
                </div>

                {/* Beneficiaries */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    উপকারভোগী
                  </label>
                  {formData.beneficiaries.map((beneficiary, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={beneficiary}
                        onChange={(e) =>
                          updateArrayField("beneficiaries", index, e.target.value)
                        }
                        placeholder={`উপকারভোগী ${index + 1}`}
                        className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField("beneficiaries", index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField("beneficiaries")}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <FaPlus /> উপকারভোগী যোগ করুন
                  </button>
                </div>

                {/* Expense Categories */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    ব্যয়ের খাত
                  </label>
                  {formData.expenseCategories.map((category, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={category}
                        onChange={(e) =>
                          updateArrayField("expenseCategories", index, e.target.value)
                        }
                        placeholder={`খাত ${index + 1}`}
                        className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField("expenseCategories", index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField("expenseCategories")}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <FaPlus /> খাত যোগ করুন
                  </button>
                </div>

                {/* Areas */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    প্রকল্পের এলাকা
                  </label>
                  {formData.areas.map((area, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={area}
                        onChange={(e) =>
                          updateArrayField("areas", index, e.target.value)
                        }
                        placeholder={`এলাকা ${index + 1}`}
                        className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayField("areas", index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayField("areas")}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <FaPlus /> এলাকা যোগ করুন
                  </button>
                </div>

                {/* Duration & Amount */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      মেয়াদ
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      placeholder="যেমন: ৬ মাস, ১ বছর"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      পরিমাণ
                    </label>
                    <input
                      type="text"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      placeholder="যেমন: ৫০,০০০ টাকা"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    গ্যালারি ছবি (একাধিক)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryImagesChange}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                  {galleryPreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {galleryPreviews.map((preview, index) => (
                        <div key={index} className="relative h-32">
                          <Image
                            src={preview}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  )}
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

                {/* Buttons */}
                <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-4 border-t">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    {editingProgram ? "আপডেট করুন" : "যোগ করুন"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramsAdmin;