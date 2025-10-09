"use client";

import { FaArrowLeft } from "react-icons/fa";
import { useSmartBack } from "@/app/hooks/useSmartBack";

interface BackButtonProps {
  fallbackRoute?: string;
  className?: string;
  text?: string;
  showText?: boolean;
  preventCycles?: boolean;
}

export default function BackButton({ 
  fallbackRoute = "/dashboard", 
  className = "",
  text,
  showText = true,
  preventCycles = true 
}: BackButtonProps) {
  const { handleBack, getBackText } = useSmartBack({ 
    fallbackRoute, 
    preventCycles 
  });

  // Use custom text if provided, otherwise use smart text
  const displayText = text || getBackText();

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center text-yellow-500 hover:text-yellow-400 transition-colors text-sm sm:text-base ${className}`}
    >
      <FaArrowLeft className="mr-2" />
      {showText && <span>{displayText}</span>}
    </button>
  );
}