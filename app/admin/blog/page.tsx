"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";
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

const AdminBlog = () => {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    images: [] as string[],
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs?limit=100`);
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
      Swal.fire("Error!", "Failed to fetch blogs", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(
          `https://api.imgbb.com/1/upload?key=c3de21f44bd6973666f3daf550420de8`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();
        if (data.success) {
          uploadedUrls.push(data.data.url);
        }
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      Swal.fire("Success!", `${uploadedUrls.length} image(s) uploaded`, "success");
    } catch (error) {
      console.error("Error uploading images:", error);
      Swal.fire("Error!", "Failed to upload images", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      Swal.fire("Error!", "Title and description are required", "error");
      return;
    }

    const token = (session as any)?.token;
    if (!token) {
      Swal.fire("Error!", "Authentication required", "error");
      return;
    }

    try {
      const url = editingBlog
        ? `${API_URL}/api/blogs/${editingBlog._id}`
        : `${API_URL}/api/blogs`;

      const response = await fetch(url, {
        method: editingBlog ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire(
          "Success!",
          editingBlog ? "Blog updated successfully" : "Blog created successfully",
          "success"
        );
        setShowModal(false);
        resetForm();
        fetchBlogs();
      } else {
        Swal.fire("Error!", data.message || "Failed to save blog", "error");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      Swal.fire("Error!", "Failed to save blog", "error");
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      videoUrl: blog.videoUrl || "",
      images: blog.images,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      const token = (session as any)?.token;
      try {
        const response = await fetch(`${API_URL}/api/blogs/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          Swal.fire("Deleted!", "Blog has been deleted", "success");
          fetchBlogs();
        } else {
          Swal.fire("Error!", data.message || "Failed to delete blog", "error");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        Swal.fire("Error!", "Failed to delete blog", "error");
      }
    }
  };

  const toggleStatus = async (blog: Blog) => {
    const token = (session as any)?.token;
    try {
      const response = await fetch(`${API_URL}/api/blogs/${blog._id}/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire("Success!", data.message, "success");
        fetchBlogs();
      } else {
        Swal.fire("Error!", data.message || "Failed to update status", "error");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      Swal.fire("Error!", "Failed to update status", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      videoUrl: "",
      images: [],
    });
    setEditingBlog(null);
  };

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    );
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ব্লগ ব্যবস্থাপনা</h1>
          <p className="text-gray-600 mt-1">Manage all blog posts</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          নতুন ব্লগ
        </button>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Image Preview */}
            {blog.images.length > 0 ? (
              <div className="relative h-48 w-full">
                <Image
                  src={blog.images[0]}
                  alt={blog.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : blog.videoUrl ? (
              <div className="relative h-48 w-full bg-gray-900">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(blog.videoUrl)}`}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    blog.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {blog.status === "published" ? "Published" : "Draft"}
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {blog.views}
                </span>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                {blog.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                {blog.description}
              </p>

              <div className="text-xs text-gray-500 mb-3">
                By {blog.author.name} • {new Date(blog.createdAt).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(blog)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  {blog.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => handleEdit(blog)}
                  className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg">No blogs yet. Create your first blog post!</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBlog ? "ব্লগ সম্পাদনা করুন" : "নতুন ব্লগ তৈরি করুন"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description / Content *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent min-h-[200px]"
                  placeholder="Write your blog content here... You can write multiple paragraphs."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Press Enter twice to create new paragraphs
                </p>
              </div>

              {/* YouTube Video URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  YouTube Video URL (Optional)
                </label>
                <input
                  type="text"
                  value={formData.videoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Images (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="imageUpload"
                    className={`cursor-pointer ${uploadingImage ? "opacity-50" : ""}`}
                  >
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600">
                      {uploadingImage ? "Uploading..." : "Click to upload images"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      You can select multiple images
                    </p>
                  </label>
                </div>

                {/* Image Previews */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <div className="relative h-32 w-full rounded-lg overflow-hidden">
                          <Image
                            src={img}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  {editingBlog ? "Update Blog" : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;