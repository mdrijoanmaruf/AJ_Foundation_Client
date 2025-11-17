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

interface VideoTopic {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface GalleryVideo {
  _id: string;
  topic: string;
  title: string;
  videoUrl: string;
  createdAt: string;
}

const AdminGallery = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  
  // Photo states
  const [topics, setTopics] = useState<Topic[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>('all');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ name: "", description: "" });
  const [newImage, setNewImage] = useState({ title: "", files: [] as File[] });
  
  // Video states
  const [videoTopics, setVideoTopics] = useState<VideoTopic[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [selectedVideoTopic, setSelectedVideoTopic] = useState<string | null>('all');
  const [videoLoading, setVideoLoading] = useState(true);
  const [showVideoTopicModal, setShowVideoTopicModal] = useState(false);
  const [showVideoUploadModal, setShowVideoUploadModal] = useState(false);
  const [newVideoTopic, setNewVideoTopic] = useState({ name: "", description: "" });
  const [newVideo, setNewVideo] = useState({ title: "", videoUrl: "" });

  useEffect(() => {
    if (activeTab === "photos") {
      fetchTopics();
    } else {
      fetchVideoTopics();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "photos") {
      if (selectedTopic === 'all') {
        fetchAllImages();
      } else if (selectedTopic) {
        fetchImages(selectedTopic);
      }
    }
  }, [selectedTopic, activeTab]);

  useEffect(() => {
    if (activeTab === "videos") {
      if (selectedVideoTopic === 'all') {
        fetchAllVideos();
      } else if (selectedVideoTopic) {
        fetchVideos(selectedVideoTopic);
      }
    }
  }, [selectedVideoTopic, activeTab]);

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

  const fetchVideoTopics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/video-topics`);
      const data = await response.json();
      setVideoTopics(data.data);
      if (data.data.length > 0 && !selectedVideoTopic) {
        setSelectedVideoTopic(data.data[0]._id);
      }
      setVideoLoading(false);
    } catch (error) {
      console.error("Error fetching video topics:", error);
      setVideoLoading(false);
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

  const fetchVideos = async (topicId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/videos/${topicId}`
      );
      const data = await response.json();
      setVideos(data.data);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const fetchAllVideos = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/videos`);
      const data = await response.json();
      setVideos(data.data);
    } catch (error) {
      console.error("Error fetching all videos:", error);
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

  const handleCreateVideoTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getAuthToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/video-topics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newVideoTopic),
      });

      if (!response.ok) throw new Error("Failed to create video topic");

      await Swal.fire({
        icon: "success",
        title: "সফল!",
        text: "ভিডিও টপিক তৈরি হয়েছে",
        showConfirmButton: false,
        timer: 1500,
      });

      setNewVideoTopic({ name: "", description: "" });
      setShowVideoTopicModal(false);
      fetchVideoTopics();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "ভিডিও টপিক তৈরি করতে ব্যর্থ হয়েছে",
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

  const handleUploadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.videoUrl || !selectedVideoTopic || selectedVideoTopic === 'all') return;

    setUploading(true);
    const token = getAuthToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/upload-video`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topicId: selectedVideoTopic,
          title: newVideo.title,
          videoUrl: newVideo.videoUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload video");
      }

      await Swal.fire({
        icon: "success",
        title: "সফল!",
        text: "ভিডিও আপলোড হয়েছে",
        showConfirmButton: false,
        timer: 1500,
      });

      setNewVideo({ title: "", videoUrl: "" });
      setShowVideoUploadModal(false);
      setUploading(false);
      if (selectedVideoTopic === 'all') {
        fetchAllVideos();
      } else if (selectedVideoTopic) {
        fetchVideos(selectedVideoTopic);
      }
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "ভিডিও আপলোড করতে ব্যর্থ হয়েছে",
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

  const handleDeleteVideo = async (videoId: string) => {
    const result = await Swal.fire({
      title: "ভিডিও মুছবেন?",
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/videos/${videoId}`,
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

        if (selectedVideoTopic === 'all') {
          fetchAllVideos();
        } else if (selectedVideoTopic) {
          fetchVideos(selectedVideoTopic);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: "ভিডিও মুছতে ব্যর্থ হয়েছে",
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

  const handleDeleteVideoTopic = async (topicId: string) => {
    const result = await Swal.fire({
      title: "ভিডিও টপিক মুছবেন?",
      text: "এই টপিকের সব ভিডিওও মুছে যাবে!",
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/video-topics/${topicId}`,
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

        setSelectedVideoTopic('all');
        fetchVideoTopics();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: "ভিডিও টপিক মুছতে ব্যর্থ হয়েছে",
        });
      }
    }
  };

  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading && activeTab === "photos") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (videoLoading && activeTab === "videos") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">গ্যালারি ম্যানেজমেন্ট</h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === "photos" ? `টপিক: ${topics.length} | ছবি: ${images.length}` : `টপিক: ${videoTopics.length} | ভিডিও: ${videos.length}`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
          <button
            onClick={() => activeTab === "photos" ? setShowTopicModal(true) : setShowVideoTopicModal(true)}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            নতুন টপিক
          </button>
          <button
            onClick={() => activeTab === "photos" ? setShowUploadModal(true) : setShowVideoUploadModal(true)}
            disabled={activeTab === "photos" ? (!selectedTopic || selectedTopic === 'all') : (!selectedVideoTopic || selectedVideoTopic === 'all')}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {activeTab === "photos" ? "ছবি আপলোড" : "ভিডিও আপলোড"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-white rounded-lg shadow-md border border-gray-200 p-1">
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "photos"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            📸 ছবি
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "videos"
                ? "bg-green-600 text-white shadow-lg"
                : "bg-transparent text-gray-600 hover:bg-gray-100"
            }`}
          >
            🎥 ভিডিও
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === "photos" ? (
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
      ) : (
        // Videos Tab
        <div className="space-y-4">
          {/* Video Topics chip list */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">ভিডিও টপিক সমূহ</h3>
              <div className="text-sm text-gray-500">{videoTopics.length}টি টপিক</div>
            </div>
            <div className="flex gap-2 overflow-x-auto py-1">
              <button
                onClick={() => {
                  setSelectedVideoTopic('all');
                  fetchAllVideos();
                }}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedVideoTopic === 'all' ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                সব ভিডিও
              </button>

              {videoTopics.map((topic) => (
                <div key={topic._id} className="relative shrink-0 group">
                  <button
                    onClick={() => setSelectedVideoTopic(topic._id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition duration-150 transform ${
                      selectedVideoTopic === topic._id ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } group-hover:scale-105`}
                  >
                    {topic.name}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteVideoTopic(topic._id); }}
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

              {videoTopics.length === 0 && (
                <div className="text-gray-500 text-sm">কোন ভিডিও টপিক নেই</div>
              )}
            </div>
          </div>

          {/* Videos Grid */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">ভিডিও সমূহ</h3>
              <div className="text-sm text-gray-500">{videos.length}টি ভিডিও</div>
            </div>
            {selectedVideoTopic ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((video) => {
                  const videoId = getYouTubeVideoId(video.videoUrl);
                  return (
                    <div key={video._id} className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        {videoId ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={video.title || "Gallery video"}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            Invalid Video URL
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {video.title && (
                        <p className="mt-2 text-sm text-gray-700 truncate">{video.title}</p>
                      )}
                    </div>
                  );
                })}
                {videos.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500">এই টপিকে কোন ভিডিও নেই</p>
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
      )}

      {/* Create Photo Topic Modal */}
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

      {/* Create Video Topic Modal */}
      {showVideoTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">নতুন ভিডিও টপিক তৈরি করুন</h2>
            </div>
            <form onSubmit={handleCreateVideoTopic} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  টপিকের নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newVideoTopic.name}
                  onChange={(e) => setNewVideoTopic({ ...newVideoTopic, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                  placeholder="যেমন: বন্যা ত্রাণ ভিডিও ২০২৪"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">বিবরণ</label>
                <textarea
                  value={newVideoTopic.description}
                  onChange={(e) => setNewVideoTopic({ ...newVideoTopic, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none resize-none"
                  placeholder="টপিক সম্পর্কে বিস্তারিত..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowVideoTopicModal(false)}
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

      {/* Upload Video Modal */}
      {showVideoUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">ভিডিও আপলোড করুন</h2>
            </div>
            <form onSubmit={handleUploadVideo} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ভিডিও শিরোনাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                  placeholder="ভিডিওর শিরোনাম"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube ভিডিও লিঙ্ক <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={newVideo.videoUrl}
                  onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  YouTube ভিডিওর সম্পূর্ণ URL প্রবেশ করান
                </p>
              </div>
              {newVideo.videoUrl && getYouTubeVideoId(newVideo.videoUrl) && (
                <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(newVideo.videoUrl)}`}
                    title="Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowVideoUploadModal(false);
                    setNewVideo({ title: "", videoUrl: "" });
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