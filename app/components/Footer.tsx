"use client";

import Link from "next/link";
import { FaDumbbell, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <FaDumbbell className="h-6 w-6 text-yellow-400" />
            <span className="font-bold text-lg">MyTrainer</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link
              href="/workouts"
              className="text-sm text-gray-400 hover:text-yellow-400"
            >
              Workouts
            </Link>
            <Link
              href="/nutrition"
              className="text-sm text-gray-400 hover:text-yellow-400"
            >
              Meal Prep
            </Link>
            <Link
              href="/progress"
              className="text-sm text-gray-400 hover:text-yellow-400"
            >
              Progress
            </Link>
            <Link
              href="/settings"
              className="text-sm text-gray-400 hover:text-yellow-400"
            >
              Settings
            </Link>
            <Link
              href="/help"
              className="text-sm text-gray-400 hover:text-yellow-400"
            >
              Help
            </Link>
          </div>

          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-yellow-400">
              <FaTwitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-400">
              <FaInstagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-yellow-400">
              <FaGithub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} MyTrainer. All rights reserved.
          </p>
          <p className="text-gray-500 mt-2 md:mt-0">
            Made with <span className="text-yellow-400">♥</span> by Collins
          </p>
        </div>
      </div>
    </footer>
  );
}
