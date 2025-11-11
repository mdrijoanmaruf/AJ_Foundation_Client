"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

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

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname?.startsWith(href);
  };

  const [open, setOpen] = useState(false);

  return (
  <header className="absolute top-6 left-0 right-0 z-50 w-full pointer-events-auto">
    <nav className="max-w-7xl bg-white shadow-lg border border-white/30 rounded-xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-3">
        {/* Left: Logo */}
        <Link
          href="/"
          className="shrink-0 text-lg sm:text-xl font-bold tracking-tight text-gray-900"
        >
          <span className="text-green-700">AJ</span> Foundation
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
        </ul>

        {/* Right: Auth buttons (desktop) and Mobile menu button */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
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
              className={`h-6 w-6 transition-transform duration-200 ${open ? "rotate-45" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {open ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
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
          <div className="bg-white/95 supports-backdrop-filter:bg-white/70 backdrop-blur rounded-b-xl shadow-md border border-white/30">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;