"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaDumbbell,
  FaHome,
  FaUtensils,
  FaChartLine,
  FaUsers,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white text-gray-800 shadow-md" : "bg-blue-800 text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center slide-in-right">
            <Link href="/" className="flex items-center space-x-2">
              <FaDumbbell className="h-8 w-8 text-sky-500" />
              <span className="font-bold text-xl">
                {scrolled ? "FitTrack" : "FitTrack"}
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4 slide-up">
              {[
                { href: "/dashboard", icon: <FaHome />, label: "Dashboard" },
                { href: "/workouts", icon: <FaDumbbell />, label: "Workouts" },
                {
                  href: "/exercises",
                  icon: <FaDumbbell />,
                  label: "Exercises",
                },
                {
                  href: "/nutrition",
                  icon: <FaUtensils />,
                  label: "Nutrition",
                },
                { href: "/progress", icon: <FaChartLine />, label: "Progress" },
                { href: "/social", icon: <FaUsers />, label: "Social" },
              ].map((item) => (
                <div
                  key={item.href}
                  className="transition-transform hover:scale-105 active:scale-95"
                >
                  <Link
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium relative group ${
                      scrolled ? "hover:text-blue-700" : "hover:bg-blue-900"
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <span
                        className={
                          scrolled ? "text-sky-500" : "text-sky-500"
                        }
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <span
                      className={`absolute bottom-0 left-0 w-0 h-0.5 bg-sky-500 transition-all duration-300 group-hover:w-full`}
                    ></span>
                  </Link>
                </div>
              ))}

              <div className="border-l pl-4 ml-2">
                <div className="transition-transform hover:scale-105 active:scale-95">
                  <Link
                    href="/profile"
                    className={`p-2 rounded-full ${
                      scrolled
                        ? "hover:bg-gray-100 text-blue-700"
                        : "hover:bg-blue-900 text-white"
                    }`}
                  >
                    <FaUser />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled
                  ? "text-blue-700 hover:bg-gray-100"
                  : "text-white hover:bg-blue-900"
              } focus:outline-none transition-colors duration-200`}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, toggle classes based on menu state */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
            scrolled ? "bg-white" : "bg-blue-800"
          }`}
        >
          {[
            { href: "/dashboard", icon: <FaHome />, label: "Dashboard" },
            { href: "/workouts", icon: <FaDumbbell />, label: "Workouts" },
            { href: "/exercises", icon: <FaDumbbell />, label: "Exercises" },
            { href: "/nutrition", icon: <FaUtensils />, label: "Nutrition" },
            { href: "/progress", icon: <FaChartLine />, label: "Progress" },
            { href: "/social", icon: <FaUsers />, label: "Social" },
            { href: "/profile", icon: <FaUser />, label: "Profile" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                scrolled
                  ? "hover:bg-gray-100 text-gray-800 hover:text-blue-700"
                  : "hover:bg-blue-900 text-white"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <span className={scrolled ? "text-blue-700" : "text-sky-500"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
          <button
            className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${
              scrolled
                ? "hover:bg-gray-100 text-gray-800 hover:text-blue-700"
                : "hover:bg-blue-900 text-white"
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className={scrolled ? "text-blue-700" : "text-sky-500"}>
                <FaSignOutAlt />
              </span>
              <span>Logout</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
