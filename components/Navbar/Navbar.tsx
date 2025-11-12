"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Swal from "sweetalert2";
import { useUserRole } from "@/hooks/useUserRole";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "হোম", href: "/" },
  { label: "আমাদের সম্পর্কে", href: "/about" },
  { label: "কার্যক্রমসমূহ", href: "/programs" },
  { label: "গ্যালারি", href: "/gallery" },
  { label: "যোগাযোগ", href: "/contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { isAdmin } = useUserRole();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "লগআউট করবেন?",
      text: "আপনি কি নিশ্চিত যে আপনি লগআউট করতে চান?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#15803d",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "হ্যাঁ, লগআউট করুন",
      cancelButtonText: "না",
    });

    if (result.isConfirmed) {
      await signOut({ redirect: false });
      await Swal.fire({
        icon: "success",
        title: "লগআউট সফল হয়েছে!",
        text: "আপনি সফলভাবে লগআউট করেছেন",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // show login success alert after OAuth redirect (flag set before redirect)
  const loginAlertShownRef = React.useRef(false);
  useEffect(() => {
    try {
      const flag = sessionStorage.getItem("aj_show_login_alert");
      if (flag === "1" && status === "authenticated" && !loginAlertShownRef.current) {
        Swal.fire({
          icon: "success",
          title: "লগইন সফল হয়েছে!",
          text: "আপনি সফলভাবে লগইন করেছেন",
          showConfirmButton: false,
          timer: 1500,
        });
        loginAlertShownRef.current = true;
        sessionStorage.removeItem("aj_show_login_alert");
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [status, session]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar if scrolling up or at the very top
      if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      } 
      // Hide navbar if scrolling down and past 100px
      else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
  <header className={`fixed top-0 left-0 right-0 z-50 px-2 md:px-0 w-full pointer-events-auto transition-transform duration-300 ${
    isVisible ? 'translate-y-0' : '-translate-y-full'
  }`}>
    <nav className="max-w-7xl bg-white shadow-lg border border-white/30 rounded-xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-4 mt-6">
        {/* Left: Logo */}
        <Link
          href="/"
          className="shrink-0 text-lg sm:text-xl font-bold tracking-tight text-gray-900"
        >
          <span className="text-green-700">A/J Khan</span> Foundation
        </Link>

        {/* Middle: Nav items */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li className="font-semibold" key={item.href}>
                <Link
                  href={item.href}
                  className={
                    "relative inline-flex items-center pb-1 text-[15px] transition-colors " +
                    (active
                      ? "text-green-700 font-semibold"
                      : "text-gray-700 hover:text-gray-900")
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                  {/* bottom green line for active route */}
                  <span
                    className={
                      "absolute left-0 -bottom-0.5 h-0.5 w-full rounded-full transition-opacity " +
                      (active ? "bg-green-600 opacity-100" : "opacity-0")
                    }
                  />
                </Link>
              </li>
            );
          })}

          {/* Admin link visible only to admin users */}
          {isAdmin && (
            <li className="font-semibold">
              {/* Distinct admin pill/button */}
              <Link
                href="/admin"
                className={
                  "inline-flex items-center gap-3 px-3 py-1 rounded-full text-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-600/20" +
                  (isActive('/admin')
                    ? ' text-green-700 font-semibold ring-1 ring-green-700/10'
                    : ' text-green-700 hover:text-green-800')
                }
                aria-current={isActive('/admin') ? 'page' : undefined}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3 6 6 .5-4.5 4 1 6-5.5-3-5.5 3 1-6L3 8.5 9 8 12 2z" />
                </svg>
                <span className="font-semibold text-sm">অ্যাডমিন</span>
              </Link>
            </li>
          )}
        </ul>

        {/* Right: Auth buttons (desktop) and Mobile menu button */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {session.user?.name || "User"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${showProfileMenu ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    প্রোফাইল
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setShowProfileMenu(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      অ্যাডমিন প্যানেল
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    লগআউট
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="px-3 sm:px-4 py-1.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-3 sm:px-4 py-1.5 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden">
          <button
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((s) => !s)}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {/* Icon: hamburger -> X */}
            <svg
              className="h-6 w-6 transition-all duration-200"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                // Cross icon
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                // Hamburger icon
                <>
                  <path d="M3 7h18" />
                  <path d="M3 12h18" />
                  <path d="M3 17h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile dropdown panel */}
      <div className="md:hidden">
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 transition-all duration-300 overflow-hidden ${open ? "max-h-[480px] py-4 opacity-100" : "max-h-0 opacity-0 py-0"}`}
          aria-hidden={!open}
        >
          <div className="bg-white rounded-b-xl shadow-md border border-gray-200">
            <div className="flex flex-col divide-y divide-gray-100">
              <div className="px-4 py-3">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block py-2 px-2 rounded-md text-base ${
                        active ? "text-green-700 font-semibold" : "text-gray-700 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="px-4 py-3 flex flex-col gap-2">
                {status === "loading" ? (
                  <div className="w-full h-10 rounded-md bg-gray-200 animate-pulse"></div>
                ) : session ? (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-200">
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                          {session.user?.name?.charAt(0).toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {session.user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.user?.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="block w-full text-center py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      প্রোফাইল
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setOpen(false)}
                        className={`block w-full text-center py-3 rounded-md font-semibold ${isActive('/admin') ? 'text-green-700' : 'border border-gray-300 text-green-700 hover:bg-green-50'}`}
                      >
                        অ্যাডমিন প্যানেল
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-center py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                      লগআউট
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="block w-full text-center py-2 rounded-md border border-gray-300 text-gray-700"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="block w-full text-center py-2 rounded-md bg-green-700 text-white"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;