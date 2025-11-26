"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Blog {
  _id: string;
  title: string;
  description: string;
  videoUrl?: string;
  images: string[];
  author: {
    _id: string;
    name: string;
    email: string;
  };
  status: "draft" | "published";
  views: number;
  createdAt: string;
  updatedAt: string;
}

const RecentBlog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBlogs();
  }, []);

  const fetchRecentBlogs = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/blogs?status=published&limit=3`
      );
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error("Error fetching recent blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    );
    return match && match[2].length === 11 ? match[2] : null;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            সাম্প্রতিক ব্লগ
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            আমাদের সর্বশেষ খবর, গল্প এবং আপডেট পড়ুন
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogs.map((blog) => (
            <Link
              key={blog._id}
              href={`/blog/${blog._id}`}
              className="group"
            >
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                {/* Image/Video */}
                <div className="relative h-56 bg-gray-200 overflow-hidden">
                  {blog.images.length > 0 ? (
                    <Image
                      src={blog.images[0]}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : blog.videoUrl ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={`https://img.youtube.com/vi/${getYouTubeVideoId(
                          blog.videoUrl
                        )}/maxresdefault.jpg`}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                          <svg
                            className="w-10 h-10 text-green-600 ml-1"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                      <svg
                        className="w-20 h-20 text-gray-400"
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
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
                    {truncateText(blog.description, 120)}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500 font-medium">
                      {formatDate(blog.createdAt)}
                    </p>
                    <div className="flex items-center gap-1 text-gray-400">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span className="text-xs">{blog.views}</span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Link
            href="/blog"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            সকল ব্লগ দেখুন
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

export default RecentBlog;