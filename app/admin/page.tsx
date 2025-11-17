"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Link from "next/link";
import {
  FaUsers,
  FaEnvelope,
  FaImages,
  FaUserShield,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaChartLine,
  FaUserPlus,
  FaCheckCircle,
  FaProjectDiagram,
} from "react-icons/fa";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  adminCount: number;
  unreadMessages: number;
  totalMessages?: number;
  totalGalleryImages?: number;
  totalPrograms?: number;
  recentActivity: Array<{
    user: string;
    action: string;
    time: string;
    type: string;
  }>;
}

const Admin = () => {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchDashboardStats();
    }
  }, [session]);

  const getAuthToken = () => {
    if (session && (session as any).token) {
      return (session as any).token;
    }
    return null;
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "ড্যাশবোর্ড তথ্য লোড করতে ব্যর্থ হয়েছে",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} সেকেন্ড আগে`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} মিনিট আগে`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ঘন্টা আগে`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} দিন আগে`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    {
      label: "মোট ব্যবহারকারী",
      value: stats?.totalUsers || 0,
      icon: <FaUsers className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      link: "/admin/all-user",
      trend: stats?.newUsersThisMonth ? `+${stats.newUsersThisMonth} এই মাসে` : null,
    },
    {
      label: "সক্রিয় ব্যবহারকারী",
      value: stats?.activeUsers || 0,
      icon: <FaCheckCircle className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      bgLight: "bg-green-50",
      textColor: "text-green-600",
      link: "/admin/all-user",
      trend: stats?.activeUsers && stats?.totalUsers 
        ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% মোট থেকে` 
        : null,
    },
    {
      label: "মোট বার্তা",
      value: stats?.totalMessages || 0,
      icon: <FaEnvelope className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      bgLight: "bg-purple-50",
      textColor: "text-purple-600",
      link: "/admin/massages",
      trend: stats?.unreadMessages ? `${stats.unreadMessages} নতুন` : null,
    },
    {
      label: "গ্যালারি ছবি",
      value: stats?.totalGalleryImages || 0,
      icon: <FaImages className="w-6 h-6" />,
      color: "from-pink-500 to-pink-600",
      bgLight: "bg-pink-50",
      textColor: "text-pink-600",
      link: "/admin/gallery",
    },
    {
      label: "প্রোগ্রাম",
      value: stats?.totalPrograms || 0,
      icon: <FaProjectDiagram className="w-6 h-6" />,
      color: "from-indigo-500 to-indigo-600",
      bgLight: "bg-indigo-50",
      textColor: "text-indigo-600",
      link: "/admin/programs",
    },
    {
      label: "অ্যাডমিন",
      value: stats?.adminCount || 0,
      icon: <FaUserShield className="w-6 h-6" />,
      color: "from-orange-500 to-orange-600",
      bgLight: "bg-orange-50",
      textColor: "text-orange-600",
      link: "/admin/all-user",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          স্বাগতম, {session?.user?.name || "অ্যাডমিন"}!
        </h1>
        <p className="text-gray-600">
          A/J Khan Foundation অ্যাডমিন ড্যাশবোর্ডে আপনাকে স্বাগতম। এখানে আপনি সম্পূর্ণ সিস্টেম পরিচালনা করতে পারবেন।
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.link || "#"}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                {stat.trend && (
                  <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                )}
              </div>
              <div className={`${stat.bgLight} p-3 rounded-lg ${stat.textColor}`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">দ্রুত কাজ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/all-user"
            className="flex items-center gap-3 p-4 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white">
              <FaUserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">ব্যবহারকারী যোগ করুন</p>
              <p className="text-sm text-gray-500">ম্যানুয়ালি যোগ করুন</p>
            </div>
          </Link>

          <Link
            href="/admin/massages"
            className="flex items-center gap-3 p-4 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <FaEnvelope className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">বার্তা দেখুন</p>
              <p className="text-sm text-gray-500">মেসেজ পরিচালনা করুন</p>
            </div>
            {stats?.unreadMessages ? (
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {stats.unreadMessages}
              </div>
            ) : null}
          </Link>

          <Link
            href="/admin/gallery"
            className="flex items-center gap-3 p-4 border-2 border-purple-600 rounded-lg hover:bg-purple-50 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white">
              <FaImages className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">গ্যালারি</p>
              <p className="text-sm text-gray-500">ছবি যোগ করুন</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">সাম্প্রতিক কার্যকলাপ</h2>
        <div className="space-y-4">
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "success" ? "bg-green-500" :
                    activity.type === "warning" ? "bg-yellow-500" : "bg-blue-500"
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{getRelativeTime(activity.time)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">কোন সাম্প্রতিক কার্যকলাপ নেই</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
