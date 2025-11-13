"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const Messages = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (session) {
      fetchMessages();
    }
  }, [session]);

  const filteredMessages = useMemo(() => {
    let list = messages.slice();

    // only search is applied (read/unread filter removed)

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((m) => {
        return (
          (m.name || "").toLowerCase().includes(q) ||
          (m.email || "").toLowerCase().includes(q) ||
          (m.subject || "").toLowerCase().includes(q) ||
          (m.message || "").toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [messages, searchQuery]);

  const getAuthToken = () => {
    if (session && (session as any).token) {
      return (session as any).token;
    }
    return null;
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }

      const data = await response.json();
      setMessages(data.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "বার্তা লোড করতে ব্যর্থ হয়েছে",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message);

    // Mark as read if not already read
    if (!message.isRead) {
      try {
        const token = getAuthToken();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/${message._id}/read`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update local state
        setMessages(messages.map(m => 
          m._id === message._id ? { ...m, isRead: true } : m
        ));
      } catch (error) {
        console.error("Error marking as read:", error);
      }
    }
  };

  const handleReply = (email: string, subject: string) => {
    const mailtoLink = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`;
    window.location.href = mailtoLink;
  };

  const handleDelete = async (messageId: string) => {
    const result = await Swal.fire({
      title: "বার্তা মুছবেন?",
      text: "আপনি কি নিশ্চিত যে আপনি এই বার্তা মুছতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "হ্যাঁ, মুছুন",
      cancelButtonText: "না",
    });

    if (result.isConfirmed) {
      try {
        const token = getAuthToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/messages/${messageId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete message");
        }

        await Swal.fire({
          icon: "success",
          title: "মুছে ফেলা হয়েছে!",
          text: "বার্তা সফলভাবে মুছে ফেলা হয়েছে",
          showConfirmButton: false,
          timer: 1500,
        });

        fetchMessages();
        setSelectedMessage(null);
      } catch (error) {
        console.error("Error deleting message:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: "বার্তা মুছতে ব্যর্থ হয়েছে",
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">সকল বার্তা</h1>
          <p className="text-sm text-gray-500 mt-1">
            মোট বার্তা: {messages.length} | অপঠিত: {messages.filter((m) => !m.isRead).length} | প্রদর্শিত: {filteredMessages.length}
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <label htmlFor="search" className="sr-only">Search</label>
          <div className="relative">
            <svg
              aria-hidden="true"
              className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অনুসন্ধান করুন"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  অবস্থা
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  নাম
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ইমেইল
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  বিষয়
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  তারিখ
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  কার্যক্রম
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMessages.map((message) => (
                <tr
                  key={message._id}
                  className={`hover:bg-gray-50 transition-colors ${
                    !message.isRead ? "bg-green-50/30" : ""
                  }`}
                >
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {message.isRead ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        পঠিত
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                        নতুন
                      </span>
                    )}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-gray-900">{message.name}</p>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700">{message.email}</p>
                  </td>

                  {/* Subject */}
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 truncate max-w-xs">
                      {message.subject}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700">
                      {new Date(message.createdAt).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewMessage(message)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      দেখুন
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredMessages.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 text-lg">কোনো মিল পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">বার্তা বিস্তারিত</h2>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Sender Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">নাম</label>
                  <p className="text-gray-900">{selectedMessage.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">ইমেইল</label>
                  <p className="text-gray-900">{selectedMessage.email}</p>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-sm font-semibold text-gray-600">বিষয়</label>
                <p className="text-gray-900">{selectedMessage.subject}</p>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-semibold text-gray-600">বার্তা</label>
                <p className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg mt-2">
                  {selectedMessage.message}
                </p>
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-semibold text-gray-600">তারিখ</label>
                <p className="text-gray-900">
                  {new Date(selectedMessage.createdAt).toLocaleString("bn-BD", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => handleReply(selectedMessage.email, selectedMessage.subject)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                উত্তর দিন
              </button>
              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                মুছুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;