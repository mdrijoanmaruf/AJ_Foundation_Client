"use client";
import React, { useState } from "react";
import TitleBg from "@/components/Contact/TitleBg";
import Swal from "sweetalert2";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs: { q: string; a: string }[] = [
    {
      q: "আমি কীভাবে দান করতে পারি?",
      a: "আপনি আমাদের 'আরও জানুন' বা 'দান করুন' পৃষ্ঠার মাধ্যমে অনলাইনে দান করতে পারেন অথবা সরাসরি ব্যাংক ট্রান্সফার ব্যবহার করতে পারেন।",
    },
    {
      q: "দানে ট্যাক্স ছাড় আছে কি?",
      a: "আমাদের প্রতিষ্ঠান নিবন্ধিত এবং নির্দিষ্ট শর্ত পূরণে দানকারীদের ট্যাক্স সুবিধা পাওয়া যেতে পারে। বিস্তারিত জানতে আমাদের সাথে যোগাযোগ করুন।",
    },
    {
      q: "আমি কীভাবে স্বেচ্ছাসেবক হিসেবে যোগ দিতে পারি?",
      a: "আপনি আমাদের যোগাযোগ ফর্ম পূরণ করে স্বেচ্ছাসেবক হিসেবে আবেদন করতে পারেন — নির্দিষ্ট আবেদন ফিল্ডগুলোতে আপনার আগ্রহ এবং সময় দিন উল্লেখ করুন।",
    },
    {
      q: "প্রকল্পে অংশগ্রহণের শর্ত কী?",
      a: "প্রকল্পভিত্তিক অংশগ্রহণের জন্য সাধারণত একটি সংক্ষিপ্ত প্রশিক্ষণ এবং আবেদন প্রক্রিয়া থাকে; প্রতিটি প্রকল্পের শর্ত ভিন্ন হতে পারে।",
    },
    {
      q: "আপনার শিক্ষামূলক কার্যক্রম কোথায় অনুষ্ঠিত হয়?",
      a: "আমাদের শিক্ষা কার্যক্রম স্থানীয় কমিউনিটি সেন্টার এবং অনলাইন উভয় স্থানে পরিচালিত হয় — নির্দিষ্ট কর্মশালার তথ্য আমাদের ক্যালেন্ডারে পাওয়া যাবে।",
    },
    {
      q: "আমি কি ব্যক্তিগতভাবে সাহায্য পেতে পারি?",
      a: "হ্যাঁ — নির্দিষ্ট শর্তের মধ্যে আমরা প্রয়োজনভিত্তিক সহায়তা প্রদান করি। দয়া করে যোগাযোগ ফর্মের মাধ্যমে আপনার প্রয়োজন উল্লেখ করুন।",
    },
    {
      q: "আপনার প্রকল্পগুলোতে অর্থনৈতিক স্বচ্ছতা কেমন?",
      a: "আমরা দান এবং ব্যয় সংক্রান্ত প্রতিবেদন নিয়মিত প্রকাশ করি; বড় মাপকাঠির প্রকল্পের জন্য অডিট রিপোর্টও পাওয়া যায়।",
    },
    {
      q: "ডোনেশন রসিদ কীভাবে পাওয়া যাবে?",
      a: "অনলাইন দানের ক্ষেত্রে ইমেইলে রসিদ পাঠানো হয়; ব্যাংক ট্রান্সফারের ক্ষেত্রে অনুরোধ করলে রসিদ প্রদান করা হবে।",
    },
    {
      q: "আমি কীভাবে আপনার সঙ্গে যোগাযোগ করব জরুরি ক্ষেত্রে?",
      a: "জরুরি যোগাযোগের জন্য উপরের ফোন নম্বরে কল করুন অথবা ইমেইল করলে দ্রুত প্রতিক্রিয়া দেওয়া হবে।",
    },
    {
      q: "আপনি কোন অঞ্চলে কাজ করেন?",
      a: "আমরা মূলত ঢাকা ও আশেপাশের অঞ্চলে কাজ করি, তবে বিশেষ প্রয়োজনে অন্যান্য অঞ্চলেও সাহায্য পৌঁছে দিই।",
    },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      await Swal.fire({
        icon: "success",
        title: "বার্তা প্রেরিত হয়েছে!",
        text: "আপনার বার্তা সফলভাবে পাঠানো হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।",
        confirmButtonColor: "#15803d",
        confirmButtonText: "ঠিক আছে",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        icon: "error",
        title: "ত্রুটি!",
        text: "বার্তা পাঠাতে সমস্যা হয়েছে। আবার চেষ্টা করুন।",
        confirmButtonColor: "#dc2626",
        confirmButtonText: "ঠিক আছে",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header (full width background) */}
      <TitleBg
        title="যোগাযোগ করুন"
        subtitle={
          "আপনার যেকোনো প্রশ্ন বা পরামর্শের জন্য আমাদের সাথে যোগাযোগ করুন। আমরা আপনার সেবায় সর্বদা প্রস্তুত।"
        }
        image={
          "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=2070&auto=format&fit=crop"
        }
      />

   

      <div className="max-w-7xl mx-auto px-4 md:px-0 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              যোগাযোগ ফর্ম
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  আপনার নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="লিখুন"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  আপনার ইমেইল <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="লিখুন"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  বিষয় <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="লিখুন"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  বার্তা <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  placeholder="লিখুন"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    প্রেরণ করা হচ্ছে...
                  </>
                ) : (
                  <>
                    প্রেরণ করুন
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
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right: Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                আমাদের ঠিকানা
              </h2>

              {/* Phone */}
              <div className="flex items-start gap-4 mb-6">
                <div className="shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">ফোন</h3>
                  <a
                    href="tel:+8801730000389"
                    className="text-gray-600 hover:text-green-700 transition-colors"
                  >
                    +৮৮০১৭৩০-০০০৩৮৯
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 mb-6">
                <div className="shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">ঠিকানা</h3>
                  <p className="text-gray-600">
                    প্লট ৬২-৬৪, রোড ৩, ব্লক এ, আফতাবনগর, ঢাকা ১২১২।
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-green-700"
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
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">ইমেইল</h3>
                  <a
                    href="mailto:contact@assunnahfoundation.org"
                    className="text-gray-600 hover:text-green-700 transition-colors"
                  >
                    contact@assunnahfoundation.org
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9065726165595!2d90.42857831498193!3d23.750890684588655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b85c1b5c7c3d%3A0x3e9c7c6e4c5f5c5e!2sAftabnagar%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1620000000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="AS-Sunnah Foundation Location"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 md:px-0 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">প্রশ্ন ও উত্তর (FAQ)</h2>

          <div className="space-y-3">
            {faqs.map((f, idx) => {
              const open = openFaq === idx;
              return (
                <div key={idx} className="overflow-hidden rounded-lg border border-gray-100">
                  <button
                    onClick={() => setOpenFaq(open ? null : idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left bg-white hover:bg-gray-50"
                  >
                    <span className="text-gray-800 font-medium">{f.q}</span>
                    <svg
                      className={`w-5 h-5 text-green-700 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className={`px-4 ${open ? "max-h-96 py-4 opacity-100" : "max-h-0 py-0 opacity-0"} transition-all duration-300 overflow-hidden bg-white`}>
                    <p className="text-gray-700">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;