"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

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

  return (
  <header className="sticky my-4 top-0 z-50 w-full bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/70 border-b border-gray-100">
      <nav className="max-w-7xl border rounded-xl border-green-500 mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-4">
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

        {/* Right: Auth buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
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
      </nav>

      {/* Mobile: center nav in a second row */}
      <div className="md:hidden border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "relative inline-flex items-center pb-0.5 text-sm transition-colors " +
                    (active
                      ? "text-green-700 font-semibold"
                      : "text-gray-700 hover:text-gray-900")
                  }
                >
                  {item.label}
                  <span
                    className={
                      "absolute left-0 -bottom-0.5 h-0.5 w-full rounded-full transition-opacity " +
                      (active ? "bg-green-600 opacity-100" : "opacity-0")
                    }
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;