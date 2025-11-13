"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  provider: string;
  createdAt: string;
}

const AllUsers = () => {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "user">("all");

  useEffect(() => {
    if (session) {
      fetchUsers();
    }
  }, [session]);

  const getAuthToken = async () => {
    // Get the token from NextAuth session
    if (session && (session as any).token) {
      return (session as any).token;
    }
    return null;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await getAuthToken();
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "ব্যবহারকারীদের তথ্য লোড করতে ব্যর্থ হয়েছে",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    let list = users.slice();

    if (roleFilter === "admin") list = list.filter((u) => u.role === "admin");
    else if (roleFilter === "user") list = list.filter((u) => u.role === "user");

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((u) => {
        return (
          (u.name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [users, searchQuery, roleFilter]);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    const actionText = newRole === "admin" ? "অ্যাডমিন বানাবেন" : "অ্যাডমিন সরাবেন";

    const result = await Swal.fire({
      title: `${actionText}?`,
      text: `আপনি কি নিশ্চিত যে আপনি এই ব্যবহারকারীকে ${newRole === "admin" ? "অ্যাডমিন বানাতে" : "সাধারণ ব্যবহারকারী করতে"} চান?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#15803d",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "হ্যাঁ, পরিবর্তন করুন",
      cancelButtonText: "না",
    });

    if (result.isConfirmed) {
      try {
        setUpdatingUserId(userId);
        const token = await getAuthToken();
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/role`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role: newRole }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update role");
        }

        await Swal.fire({
          icon: "success",
          title: "সফল!",
          text: "ব্যবহারকারীর ভূমিকা সফলভাবে পরিবর্তন হয়েছে",
          showConfirmButton: false,
          timer: 1500,
        });

        // Refresh users list
        fetchUsers();
      } catch (error) {
        console.error("Error updating role:", error);
        Swal.fire({
          icon: "error",
          title: "ত্রুটি!",
          text: "ভূমিকা পরিবর্তন করতে ব্যর্থ হয়েছে",
        });
      } finally {
        setUpdatingUserId(null);
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
          <h1 className="text-2xl font-bold text-gray-900">সকল ব্যবহারকারী</h1>
          <p className="text-sm text-gray-500 mt-1">
            মোট ব্যবহারকারী: {users.length} | প্রদর্শিত: {filteredUsers.length}
          </p>
        </div>

        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative flex-1">
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
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অনুসন্ধান করুন "
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
          >
            <option value="all">সব</option>
            <option value="admin">অ্যাডমিন</option>
            <option value="user">ব্যবহারকারী</option>
          </select>

          {/* <button
            onClick={() => { setSearchQuery(""); setRoleFilter("all"); }}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            title="Clear filters"
          >
            রিসেট
          </button> */}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ব্যবহারকারী
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ইমেইল
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  প্রদানকারী
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ভূমিকা
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  যোগদানের তারিখ
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  কার্যক্রম
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className={`hover:bg-gray-50 transition-colors ${
                    user.role === "admin" ? "bg-green-50/30" : ""
                  }`}
                >
                  {/* User Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700">{user.email}</p>
                  </td>

                  {/* Provider */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.provider === "google"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.provider === "google" ? "Google" : "Local"}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-green-100 text-green-800 border border-green-300"
                          : "bg-gray-100 text-gray-800 border border-gray-300"
                      }`}
                    >
                      {user.role === "admin" ? "অ্যাডমিন" : "ব্যবহারকারী"}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm text-gray-700">
                      {new Date(user.createdAt).toLocaleDateString("bn-BD", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleRoleToggle(user._id, user.role)}
                      disabled={updatingUserId === user._id}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        user.role === "admin"
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-green-600 hover:bg-green-700 text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {updatingUserId === user._id ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          প্রক্রিয়াকরণ...
                        </span>
                      ) : user.role === "admin" ? (
                        "অ্যাডমিন সরান"
                      ) : (
                        "অ্যাডমিন বানান"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">কোনো মিল পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;