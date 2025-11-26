"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Login form submitted for:", formData.email);
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        console.error("Login failed with error:", result.error);
        setError("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
        setLoading(false);
        return;
      }

      if (!result?.ok) {
        console.error("Login failed - result not ok");
        setError("ইমেইল বা পাসওয়ার্ড ভুল হয়েছে");
        setLoading(false);
        return;
      }

      console.log("Login successful!");

      await Swal.fire({
        icon: "success",
        title: "লগইন সফল হয়েছে!",
        text: "আপনি সফলভাবে লগইন করেছেন",
        showConfirmButton: false,
        timer: 1500,
      });

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setError("লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      // set a flag so when the user is redirected back after OAuth we can show a success alert
      try {
        sessionStorage.setItem("aj_show_login_alert", "1");
      } catch (e) {
        // ignore storage errors
      }

      // Redirect to Google sign-in (NextAuth will handle the redirect)
      await signIn("google", {
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      setError("গুগল দিয়ে লগইন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">লগইন করুন</h2>
          <p className="mt-2 text-sm text-gray-600">
            আপনার অ্যাকাউন্টে প্রবেশ করুন
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ইমেইল
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                পাসওয়ার্ড
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2.5 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">অথবা</span>
              </div>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-6 w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            গুগল দিয়ে লগইন করুন
          </button>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              নতুন ব্যবহারকারী?{" "}
              <Link
                href="/register"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                রেজিস্টার করুন
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
