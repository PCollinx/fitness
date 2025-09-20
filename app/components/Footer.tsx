"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="mt-6 pt-4 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
        <p className="text-gray-500">
          &copy; {new Date().getFullYear()} MyTrainer. All rights reserved.
        </p>
        <p className="text-gray-500 mt-2 md:mt-0">
          Made with <span className="text-yellow-400">♥</span> by Collins
        </p>
      </div>
    </footer>
  );
}
