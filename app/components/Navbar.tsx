"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  FaDumbbell,
  FaHome,
  FaUtensils,
  FaChartLine,
  FaUser,
  FaSearch,
  FaBell,
  FaMusic,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus
} from "react-icons/fa";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 bg-gray-900 text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <FaDumbbell className="h-8 w-8 text-yellow-400" />
              <span className="font-bold text-xl">MyTrainer</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {[
                { href: "/", icon: <FaHome />, label: "Home" },
                { href: "/workouts", icon: <FaDumbbell />, label: "Workouts" },
                {
                  href: "/nutrition",
                  icon: <FaUtensils />,
                  label: "Meal Prep",
                },
                { href: "/progress", icon: <FaChartLine />, label: "Progress" },
                { href: "/music", icon: <FaMusic />, label: "Music" },
              ].map((item) => (
                <div
                  key={item.href}
                  className="transition-transform hover:scale-105"
                >
                  <Link
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium relative group hover:text-yellow-400"
                  >
                    <div className="flex items-center space-x-1">
                      <span className="text-gray-400 group-hover:text-yellow-400">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white">
              <FaSearch className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white">
              <FaBell className="h-5 w-5" />
            </button>
            
            {/* Profile dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} 
                className="p-2 rounded-full hover:bg-gray-800 text-white flex items-center"
              >
                {session?.user ? (
                  session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || "User"} 
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <div className="bg-yellow-500 h-6 w-6 rounded-full flex items-center justify-center text-gray-900 font-bold">
                      {session.user.name?.charAt(0) || 'U'}
                    </div>
                  )
                ) : (
                  <FaUser className="h-5 w-5" />
                )}
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  {session?.user ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{session.user.name}</p>
                        <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                      </div>
                      <Link 
                        href="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FaUser className="mr-2" /> Profile
                      </Link>
                      <Link 
                        href="/dashboard" 
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FaChartLine className="mr-2" /> Dashboard
                      </Link>
                      <button 
                        onClick={() => {
                          signOut({ callbackUrl: '/' });
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        <FaSignOutAlt className="mr-2" /> Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        href="/auth/signin" 
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FaSignInAlt className="mr-2" /> Sign in
                      </Link>
                      <Link 
                        href="/auth/signup" 
                        className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <FaUserPlus className="mr-2" /> Sign up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none transition-colors duration-200"
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
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-gray-900 px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800">
          {[
            { href: "/", icon: <FaHome />, label: "Home" },
            { href: "/workouts", icon: <FaDumbbell />, label: "Workouts" },
            { href: "/nutrition", icon: <FaUtensils />, label: "Meal Prep" },
            { href: "/progress", icon: <FaChartLine />, label: "Progress" },
            { href: "/music", icon: <FaMusic />, label: "Music" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <span className="text-gray-400">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
          
          {/* Authentication links for mobile */}
          <div className="border-t border-gray-700 pt-2 mt-2">
            {session?.user ? (
              <>
                <Link
                  href="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400"><FaChartLine /></span>
                    <span>Dashboard</span>
                  </div>
                </Link>
                <Link
                  href="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400"><FaUser /></span>
                    <span>Profile</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' });
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 text-white"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400"><FaSignOutAlt /></span>
                    <span>Sign out</span>
                  </div>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400"><FaSignInAlt /></span>
                    <span>Sign in</span>
                  </div>
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800 text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400"><FaUserPlus /></span>
                    <span>Sign up</span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
