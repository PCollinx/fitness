"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

interface BackNavigationProps {
  title?: string;
  href?: string;
}

export default function BackNavigation({
  title = "Back",
  href = "/mobile",
}: BackNavigationProps) {
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-50 p-4">
      <Link href={href} className="flex items-center space-x-2 text-white">
        <FaArrowLeft className="h-5 w-5" />
        <span>{title}</span>
      </Link>
    </div>
  );
}
