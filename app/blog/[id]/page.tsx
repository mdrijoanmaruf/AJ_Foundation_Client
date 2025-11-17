"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

interface RelatedBlog {
  _id: string;
  title: string;
  images: string[];
  createdAt: string;
}

const BlogDetails = () => {
  const params = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<RelatedBlog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchBlogDetails();
    }
  }, [params.id]);

  const fetchBlogDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setBlog(data.data);
        fetchRelatedBlogs();
      } else {
        router.push("/blog");
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      router.push("/blog");
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs?status=published&limit=3`);
      const data = await response.json();
      if (data.success) {
        setRelatedBlogs(
          data.data.filter((b: RelatedBlog) => b._id !== params.id).slice(0, 3)
        );
      }
    } catch (error) {
      console.error("Error fetching related blogs:", error);
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

  const renderDescription = (description: string) => {
    return description.split("\n").map((paragraph, index) => {
      if (paragraph.trim() === "") return null;
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed text-lg">
          {paragraph}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <>
      {/* Hero Section */}
      <TitleBg 
        title={blog.title}
        subtitle={
          <div className="flex items-center justify-center gap-6 mt-4">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {blog.author.name}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(blog.createdAt)}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {blog.views} views
            </span>
          </div>
        }
        image={blog.images[0] || "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2073&auto=format&fit=crop"}
        className="mb-0"
      />

      <section className="py-16 px-4 md:px-8 lg:px-16 bg-linear-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <ol className="flex items-center gap-3 text-gray-600">
              <li>
                <Link href="/" className="hover:text-green-700 transition-colors font-medium">
                  হোম
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/blog" className="hover:text-green-700 transition-colors font-medium">
                  ব্লগ
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-green-700 font-semibold truncate max-w-[300px]">{blog.title}</li>
            </ol>
          </nav>

          {/* Main Content */}
          <article className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-16">
          {/* YouTube Video */}
          {blog.videoUrl && (
            <div className="p-8 md:p-12">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-xl" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                    blog.videoUrl
                  )}`}
                  className="absolute top-0 left-0 w-full h-full"
                  allowFullScreen
                  title={blog.title}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="px-8 md:px-16 py-12">
            <div className="prose prose-xl max-w-none">
              {renderDescription(blog.description)}
            </div>
          </div>

          {/* Additional Images */}
          {blog.images.length > 1 && (
            <div className="px-8 md:px-12 pb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">আরও ছবি</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blog.images.slice(1).map((image, index) => (
                  <div key={index} className="relative h-80 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                    <Image
                      src={image}
                      alt={`${blog.title} - Image ${index + 2}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-1 w-12 bg-green-600 rounded"></div>
              <h2 className="text-3xl font-bold text-gray-900">সম্পর্কিত ব্লগ</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  key={relatedBlog._id}
                  href={`/blog/${relatedBlog._id}`}
                  className="group"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-52 bg-gray-200 overflow-hidden">
                      {relatedBlog.images.length > 0 ? (
                        <Image
                          src={relatedBlog.images[0]}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                          <svg
                            className="w-16 h-16 text-gray-400"
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
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-green-700 transition-colors mb-3 leading-tight">
                        {relatedBlog.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {formatDate(relatedBlog.createdAt)}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog Button */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold text-lg"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            সকল ব্লগ দেখুন
          </Link>
        </div>
      </div>
    </section>
    </>
  );
};

export default BlogDetails;