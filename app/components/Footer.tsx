"use client";

import Link from "next/link";
import { FaDumbbell, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-700 to-blue-900 text-white fade-in">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="flex items-center space-x-2 transition-transform hover:scale-105"
            >
              <FaDumbbell className="h-8 w-8 text-white" />
              <span className="font-bold text-xl text-white">FitTrack</span>
            </Link>
            <p className="mt-2 text-sm text-white">
              Track your fitness journey with precision and share your success
              with friends.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Features
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/workouts"
                  className="text-gray-200 hover:text-white hover:underline transition-colors duration-200"
                >
                  Workout Plans
                </Link>
              </li>
              <li>
                <Link
                  href="/nutrition"
                  className="text-gray-200 hover:text-white hover:underline transition-colors duration-200"
                >
                  Nutrition Tracking
                </Link>
              </li>
              <li>
                <Link
                  href="/progress"
                  className="text-gray-200 hover:text-white hover:underline transition-colors duration-200"
                >
                  Progress Monitoring
                </Link>
              </li>
              <li>
                <Link
                  href="/social"
                  className="text-gray-200 hover:text-white hover:underline transition-colors duration-200"
                >
                  Social Features
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-200 hover:text-white hover:underline transition-colors duration-200"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-200 hover:text-white hover:underline transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-200 hover:text-white hover:underline transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-200 hover:text-white hover:underline transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Connect
            </h3>
            <div className="mt-4 flex space-x-6">
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                <FaGithub className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                <FaTwitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="#"
                className="text-gray-200 hover:text-white transition-colors duration-200"
              >
                <FaInstagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-sm text-gray-200">
            &copy; {new Date().getFullYear()} FitTrack. All rights reserved.
          </p>
          <p className="mt-4 text-sm text-white font-medium md:mt-0">
            Made with <span className="animate-pulse inline-block">❤️</span> by
            Collins
          </p>
        </div>
      </div>
    </footer>
  );
}
