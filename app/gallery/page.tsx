"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import TitleBg from "../../components/Contact/TitleBg";

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

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  
  // Photo states
  const [topics, setTopics] = useState<Topic[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [lightboxImageLoaded, setLightboxImageLoaded] = useState(false);
  const [lightboxImageSrc, setLightboxImageSrc] = useState<string>("");
  
  // Video states
  const [videoTopics, setVideoTopics] = useState<VideoTopic[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [selectedVideoTopic, setSelectedVideoTopic] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "photos") {
      fetchTopics();
    } else {
      setSelectedVideoTopic(null);
      fetchVideoTopics();
    }
  }, [activeTab]);

  useEffect(() => {
    if (selectedTopic) {
      fetchImages(selectedTopic);
    } else if (selectedTopic === null && topics.length === 0) {
      // Show all images when no topic selected and no topics exist
      fetchAllImages();
    }
  }, [selectedTopic, topics]);

  useEffect(() => {
    if (selectedVideoTopic) {
      // Load videos for the selected topic
      fetchVideos(selectedVideoTopic);
    } else {
      // Load all videos (used when selecting "সব ভিডিও")
      fetchAllVideos();
    }
  }, [selectedVideoTopic, videoTopics]);

  // Preload first few images for better performance
  useEffect(() => {
    if (images.length > 0) {
      // Preload first 3 images
      images.slice(0, 3).forEach((image) => {
        const img = new window.Image();
        img.src = image.imageUrl;
      });
    }
  }, [images]);

  const fetchTopics = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/topics`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.data && Array.isArray(data.data)) {
        setTopics(data.data);
      } else {
        setTopics([]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching topics:", error);
      setTopics([]);
      setLoading(false);
    }
  };

  const fetchImages = async (topicId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/images/${topicId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.data && Array.isArray(data.data)) {
        setImages(data.data);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    }
  };

  const fetchAllImages = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/images`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.data && Array.isArray(data.data)) {
        setImages(data.data);
      } else {
        setImages([]);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
    }
  };

  const fetchVideoTopics = async () => {
    try {
      setVideoLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/video-topics`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.data && Array.isArray(data.data)) {
        setVideoTopics(data.data);
      } else {
        setVideoTopics([]);
      }
      // videoLoading will be controlled by fetchAllVideos/fetchVideos
    } catch (error) {
      console.error("Error fetching video topics:", error);
      setVideoTopics([]);
      setVideoLoading(false);
    }
  };

  const fetchVideos = async (topicId: string) => {
    try {
      setVideoLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/gallery/videos/${topicId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.data && Array.isArray(data.data)) {
        setVideos(data.data);
      } else {
        setVideos([]);
      }
      setVideoLoading(false);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
      setVideoLoading(false);
    }
  };

  const fetchAllVideos = async () => {
    try {
      setVideoLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/videos`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data && data.data && Array.isArray(data.data)) {
        setVideos(data.data);
      } else {
        setVideos([]);
      }
      setVideoLoading(false);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setVideos([]);
      setVideoLoading(false);
    }
  };

  const handleTopicSelect = (topicId: string | null) => {
    setSelectedTopic(topicId);
    if (topicId === null) {
      fetchAllImages();
    }
  };

  const handleVideoTopicSelect = (topicId: string | null) => {
    setSelectedVideoTopic(topicId);
    if (topicId === null) {
      fetchAllVideos();
    }
  };

  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleImageClick = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
    setLightboxImageLoaded(false);

    // Preload the full image
    const img = new window.Image();
    img.onload = () => {
      setLightboxImageSrc(images[imageIndex].imageUrl);
      setLightboxImageLoaded(true);
    };
    img.src = images[imageIndex].imageUrl;

    // Preload adjacent images for faster navigation
    preloadAdjacentImages(imageIndex);
  };

  const preloadAdjacentImages = (currentIndex: number) => {
    // Preload previous image
    if (currentIndex > 0) {
      const prevImg = new window.Image();
      prevImg.src = images[currentIndex - 1].imageUrl;
    }

    // Preload next image
    if (currentIndex < images.length - 1) {
      const nextImg = new window.Image();
      nextImg.src = images[currentIndex + 1].imageUrl;
    }
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      const nextIndex = selectedImageIndex + 1;
      setSelectedImageIndex(nextIndex);
      setLightboxImageLoaded(false);

      // Check if next image is already preloaded
      const img = new window.Image();
      img.onload = () => {
        setLightboxImageSrc(images[nextIndex].imageUrl);
        setLightboxImageLoaded(true);
      };
      img.src = images[nextIndex].imageUrl;

      preloadAdjacentImages(nextIndex);
    }
  };

  const handlePrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      const prevIndex = selectedImageIndex - 1;
      setSelectedImageIndex(prevIndex);
      setLightboxImageLoaded(false);

      // Check if previous image is already preloaded
      const img = new window.Image();
      img.onload = () => {
        setLightboxImageSrc(images[prevIndex].imageUrl);
        setLightboxImageLoaded(true);
      };
      img.src = images[prevIndex].imageUrl;

      preloadAdjacentImages(prevIndex);
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImageIndex(null);
    setLightboxImageLoaded(false);
    setLightboxImageSrc("");
  };

  if ((loading && activeTab === "photos") || (videoLoading && activeTab === "videos")) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-white">
      {/* Title Background */}
      <TitleBg
        title="আমাদের গ্যালারি"
        subtitle="এজে খান ফাউন্ডেশনের বিভিন্ন কার্যক্রম ও অনুষ্ঠানের স্মৃতিচারণ"
        className="mb-8"
      />

      <div className="max-w-7xl mx-auto px-4 md:px-0 pb-16">

        {/* Tabs */}
        <div className="flex justify-center mb-8">
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

        {/* Content */}
        {activeTab === "photos" ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Topics Sidebar */}
            {topics.length > 0 && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    টপিক সমূহ
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleTopicSelect(null)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
                        selectedTopic === null
                          ? "bg-green-600 text-white shadow-lg"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      সব ছবি
                    </button>
                    {topics.map((topic) => (
                      <button
                        key={topic._id}
                        onClick={() => handleTopicSelect(topic._id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all font-medium ${
                          selectedTopic === topic._id
                            ? "bg-green-600 text-white shadow-lg"
                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {topic.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Images Grid */}
            <div className={topics.length > 0 ? "lg:col-span-3" : "col-span-full"}>
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-6">
                  {selectedTopic
                    ? topics.find((t) => t._id === selectedTopic)?.name || "ছবি সমূহ"
                    : "সব ছবি"}
                </h3>
                {images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={image._id}
                        className="group cursor-pointer relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105"
                        onClick={() => handleImageClick(index)}
                      >
                        <div className="aspect-square bg-gray-100">
                          <Image
                            src={image.thumbnailUrl || image.imageUrl}
                            alt={image.title || "Gallery image"}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                            />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg
                      className="w-24 h-24 mx-auto text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">এখনো কোন ছবি আপলোড করা হয়নি</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-8">
            {/* Video Topics Sidebar */}
            <div className="w-64 shrink-0">
              <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">ভিডিও বিষয়</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleVideoTopicSelect(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                      selectedVideoTopic === null
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    সব ভিডিও
                  </button>
                  {videoTopics.map((topic) => (
                    <button
                      key={topic._id}
                      onClick={() => handleVideoTopicSelect(topic._id)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
                        selectedVideoTopic === topic._id
                          ? "bg-green-600 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {topic.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {videos.length === 0 ? (
                  <div className="col-span-full text-center py-16 bg-white rounded-lg shadow-md border border-gray-200">
                    <svg
                      className="w-24 h-24 mx-auto text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-500 text-lg font-medium">এখনো কোন ভিডিও আপলোড করা হয়নি</p>
                  </div>
                ) : (
                  videos.map((video) => {
                    const videoId = getYouTubeVideoId(video.videoUrl);
                    return (
                      <div
                        key={video._id}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
                      >
                        <div className="aspect-video">
                          {videoId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={video.title}
                              className="w-full h-full"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <p className="text-gray-500">ভিডিও লোড করা যাচ্ছে না</p>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-800">{video.title}</h4>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && images[selectedImageIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={handleCloseLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            onClick={handleCloseLightbox}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous Button */}
          {selectedImageIndex > 0 && (
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {selectedImageIndex < images.length - 1 && (
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm z-10">
            {selectedImageIndex + 1} / {images.length}
          </div>

          {/* Main Image (centered, thumbnail-first then full image) */}
          <div className="max-w-5xl w-full flex items-center justify-center">
            <div className="relative">
              {/* Loading state (covers image area) */}
              {!lightboxImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-lg z-20">
                  <div className="text-white text-center">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p>ছবি লোড হচ্ছে...</p>
                  </div>
                </div>
              )}

              {/* Thumbnail (shown immediately) */}
              <Image
                src={images[selectedImageIndex].thumbnailUrl || images[selectedImageIndex].imageUrl}
                alt={images[selectedImageIndex].title || "Gallery image"}
                width={1200}
                height={800}
                className={`max-w-[90vw] max-h-[80vh] rounded-lg transition-opacity duration-300 ${
                  lightboxImageLoaded ? 'opacity-0' : 'opacity-100'
                }`}
                onClick={(e) => e.stopPropagation()}
              />

              {/* Full image (shown after loading) */}
              {lightboxImageLoaded && (
                <Image
                  src={lightboxImageSrc}
                  alt={images[selectedImageIndex].title || "Gallery image"}
                  width={1200}
                  height={800}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-[90vw] max-h-[80vh] rounded-lg transition-opacity duration-300 opacity-100 z-10"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;