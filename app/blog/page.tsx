"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import TitleBg from "@/components/Contact/TitleBg";

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

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 10;

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs);
    } else {
      const filtered = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, blogs]);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs?status=published&limit=100`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
        setFilteredBlogs(data.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
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

  // Pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section with TitleBg */}
      <TitleBg 
        title="ব্লগ" 
        subtitle="আমাদের সর্বশেষ সংবাদ এবং আপডেট পড়ুন"
        image="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop"
        className="mb-0"
      />

      <section className="py-16 px-4 md:px-8 lg:px-16 bg-linear-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="ব্লগ সার্চ করুন"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm hover:border-gray-300 transition-colors"
              />
            </div>

            <div className="mt-8 flex justify-center border-b border-gray-200">
              <button className="px-8 py-3 text-green-700 font-bold text-lg border-b-4 border-green-700 -mb-px">
                সকল ব্লগ
              </button>
            </div>
          </div>

          {/* Blog Grid - True 3 Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBlogs.map((blog) => (
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
                    <h2 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-green-700 transition-colors line-clamp-2 leading-tight">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
                      {truncateText(blog.description, 120)}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 font-medium">
                        {formatDate(blog.createdAt)}
                      </p>
                      <div className="flex items-center gap-1 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-xs">{blog.views}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredBlogs.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-xl font-semibold">
                {searchQuery ? "কোনো ব্লগ পাওয়া যায়নি" : "এখনো কোনো ব্লগ নেই"}
              </p>
              {searchQuery && (
                <p className="text-gray-400 mt-2">অন্য কিওয়ার্ড দিয়ে খোঁজ করুন</p>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="flex justify-center mt-16" aria-label="pagination">
              <ul className="flex items-center gap-2">
                {/* Previous Button */}
                <li>
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-3 rounded-xl border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all"
                    aria-label="পূর্ববর্তী পৃষ্ঠা"
                  >
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                </li>

                {/* Page Numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }

                  return (
                    <li key={pageNumber}>
                      <button
                        onClick={() => paginate(pageNumber)}
                        className={`min-w-12 px-4 py-3 rounded-xl border-2 font-semibold transition-all ${
                          currentPage === pageNumber
                            ? "bg-green-600 text-white border-green-600 shadow-lg scale-110"
                            : "border-gray-300 hover:border-green-600 hover:bg-green-50"
                        }`}
                        aria-label={`পৃষ্ঠা ${pageNumber}`}
                        aria-current={currentPage === pageNumber ? "page" : undefined}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                })}

                {/* Next Button */}
                <li>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-3 rounded-xl border-2 border-gray-300 hover:border-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent transition-all"
                    aria-label="পরবর্তী পৃষ্ঠা"
                  >
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>
    </>
  );
};

export default Blog;