"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";

interface Topic {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface GalleryImage {
  _id: string;
  topic: string;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  createdAt: string;
}

const AdminGallery = () => {
  const { data: session } = useSession();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: "", description: "" });
  const [newImage, setNewImage] = useState({ title: "", files: [] as File[] });

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
    if (selectedTopic === 'all') {
      fetchAllImages();
    } else if (selectedTopic) {
      fetchImages(selectedTopic);
    }
  }, [selectedTopic]);

  const fetchAllImages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/images`);
      const data = await response.json();
      setImages(data.data);
    } catch (error) {
      console.error("Error fetching all images:", error);
    }
  };

  const getAuthToken = () => {
    if (session && (session as any).token) {
      return (session as any).token;
    }
    return null;
  };

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/topics`);
      const data = await response.json();
      setTopics(data.data);
      if (data.data.length > 0 && !selectedTopic) {
        setSelectedTopic(data.data[0]._id);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setLoading(false);
    }
  };

  const fetchImages = async (topicId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/images/${topicId}`
      );
      const data = await response.json();
      setImages(data.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/topics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTopic),
      });

      if (!response.ok) throw new Error("Failed to create topic");

      await Swal.fire({
        icon: "success",
        title: "সফল!",
        text: "টপিক তৈরি হয়েছে",
        showConfirmButton: false,
        timer: 1500,
      });

      setNewTopic({ name: "", description: "" });
      setShowTopicModal(false);
      fetchTopics();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "টপিক তৈরি করতে ব্যর্থ হয়েছে",
      });
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);

      // Validate file types and sizes
      const validFiles = filesArray.filter(file => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (!validTypes.includes(file.type)) {
          Swal.fire({
            icon: "error",
            title: "অবৈধ ফাইল",
            text: `${file.name} একটি বৈধ ছবি ফাইল নয়। শুধুমাত্র JPG, PNG, GIF, WebP ফাইল গ্রহণযোগ্য।`,
          });
          return false;
        }

        if (file.size > maxSize) {
          Swal.fire({
            icon: "error",
            title: "ফাইল খুব বড়",
            text: `${file.name} এর আকার 10MB এর বেশি। অনুগ্রহ করে ছোট আকারের ছবি ব্যবহার করুন।`,
          });
          return false;
        }

        return true;
      });

      setNewImage({ ...newImage, files: validFiles });
    }
  };

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.files.length || !selectedTopic || selectedTopic === 'all') return;

    setUploading(true);
    const token = getAuthToken();

    try {
      let successCount = 0;
      let errorCount = 0;

      // Upload each image
      for (const file of newImage.files) {
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/upload`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              topicId: selectedTopic,
              title: newImage.title || file.name,
              image: base64,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to upload image");
          }

          successCount++;
        } catch (error) {
          console.error("Error uploading file:", file.name, error);
          errorCount++;
        }
      }

      // Show result
      if (successCount > 0) {
        await Swal.fire({
          icon: errorCount > 0 ? "warning" : "success",
          title: errorCount > 0 ? "আংশিক সফল" : "সফল!",
          text: `${successCount}টি ছবি আপলোড হয়েছে${errorCount > 0 ? `, ${errorCount}টি ব্যর্থ` : ""}`,
          showConfirmButton: true,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: "কোন ছবি আপলোড করা যায়নি",
        });
      }

      setNewImage({ title: "", files: [] });
      setShowUploadModal(false);
      setUploading(false);
      if (selectedTopic === 'all') {
        fetchAllImages();
      } else if (selectedTopic) {
        fetchImages(selectedTopic);
      }
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "ছবি আপলোড করতে ব্যর্থ হয়েছে",
      });
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    const result = await Swal.fire({
      title: "ছবি মুছবেন?",
      text: "আপনি কি নিশ্চিত?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "হ্যাঁ, মুছুন",
      cancelButtonText: "না",
    });

    if (result.isConfirmed) {
      const token = getAuthToken();
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/images/${imageId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to delete");

        await Swal.fire({
          icon: "success",
          title: "মুছে ফেলা হয়েছে!",
          showConfirmButton: false,
          timer: 1500,
        });

        if (selectedTopic === 'all') {
          fetchAllImages();
        } else if (selectedTopic) {
          fetchImages(selectedTopic);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: "ছবি মুছতে ব্যর্থ হয়েছে",
        });
      }
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    const result = await Swal.fire({
      title: "টপিক মুছবেন?",
      text: "এই টপিকের সব ছবিও মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "হ্যাঁ, মুছুন",
      cancelButtonText: "না",
    });

    if (result.isConfirmed) {
      const token = getAuthToken();
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/topics/${topicId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to delete");

        await Swal.fire({
          icon: "success",
          title: "মুছে ফেলা হয়েছে!",
          showConfirmButton: false,
          timer: 1500,
        });

            setSelectedTopic('all');
        fetchTopics();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: "টপিক মুছতে ব্যর্থ হয়েছে",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">গ্যালারি ম্যানেজমেন্ট</h1>
          <p className="text-sm text-gray-500 mt-1">টপিক: {topics.length} | ছবি: {images.length}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTopicModal(true)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            নতুন টপিক
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
          disabled={!selectedTopic || selectedTopic === 'all'}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            ছবি আপলোড
          </button>
        </div>
      </div>

      {/* Topics (top) and Images */}
      <div className="space-y-4">
        {/* Topics chip list */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">টপিক সমূহ</h3>
            <div className="text-sm text-gray-500">{topics.length}টি টপিক</div>
          </div>
          <div className="flex gap-2 overflow-x-auto py-1">
            <button
              onClick={() => {
                setSelectedTopic('all');
                fetchAllImages();
              }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTopic === 'all' ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              সব ছবি
            </button>

            {topics.map((topic) => (
              <div key={topic._id} className="relative shrink-0 group">
                <button
                  onClick={() => setSelectedTopic(topic._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition duration-150 transform ${
                    selectedTopic === topic._id ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } group-hover:scale-105`}
                >
                  {topic.name}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteTopic(topic._id); }}
                  title="ডিলিট"
                  aria-label={`Delete ${topic.name}`}
                  className="absolute -right-2 -top-2 text-red-600 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full shadow"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}

            {topics.length === 0 && (
              <div className="text-gray-500 text-sm">কোন টপিক নেই</div>
            )}
          </div>
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">ছবি সমূহ</h3>
            <div className="text-sm text-gray-500">{images.length}টি ছবি</div>
          </div>
          {selectedTopic ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image._id} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={image.imageUrl}
                      alt={image.title || "Gallery image"}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteImage(image._id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  {image.title && (
                    <p className="mt-2 text-sm text-gray-700 truncate">{image.title}</p>
                  )}
                </div>
              ))}
              {images.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500">এই টপিকে কোন ছবি নেই</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">একটি টপিক নির্বাচন করুন</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">নতুন টপিক তৈরি করুন</h2>
            </div>
            <form onSubmit={handleCreateTopic} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  টপিকের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTopic.name}
                  onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                  placeholder="যেমন: বন্যা ত্রাণ ২০২৪"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">বিবরণ</label>
                <textarea
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none resize-none"
                  placeholder="টপিক সম্পর্কে বিস্তারিত..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowTopicModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  তৈরি করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Image Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">ছবি আপলোড করুন</h2>
            </div>
            <form onSubmit={handleUploadImage} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">শিরোনাম</label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                  placeholder="ছবির শিরোনাম (ঐচ্ছিক)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ছবি নির্বাচন করুন <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  required
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  multiple
                  onChange={handleImageSelect}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  সর্বোচ্চ 10MB প্রতি ছবি, JPG, PNG, GIF, WebP ফরম্যাট সমর্থিত
                </p>
                {newImage.files.length > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {newImage.files.length}টি ছবি নির্বাচিত
                  </p>
                )}
              </div>
              {newImage.files.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {newImage.files.slice(0, 6).map((file, index) => (
                    <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {newImage.files.length > 6 && (
                    <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">+{newImage.files.length - 6}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    setNewImage({ title: "", files: [] });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
                  disabled={uploading}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      আপলোড হচ্ছে...
                    </>
                  ) : (
                    "আপলোড করুন"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;