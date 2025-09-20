"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaHome, FaDumbbell, FaChartLine, FaMusic } from "react-icons/fa";

const navItems = [
  {
    name: "Home",
    href: "/dashboard",
    icon: FaHome,
  },
  {
    name: "Workouts",
    href: "/workouts",
    icon: FaDumbbell,
  },
  {
    name: "Progress",
    href: "/progress",
    icon: FaChartLine,
  },
  {
    name: "Music",
    href: "/music",
    icon: FaMusic,
  },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [pressedItem, setPressedItem] = useState<string | null>(null);

  const getActiveIndex = () => {
    return navItems.findIndex(
      (item) =>
        pathname === item.href ||
        (item.href === "/dashboard" && pathname === "/")
    );
  };

  const activeIndex = getActiveIndex();

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Backdrop with blur */}
        <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-xl border-t border-gray-800/50" />

        {/* Active indicator background */}
        {activeIndex >= 0 && (
          <div
            className="absolute top-0 h-full bg-yellow-400/5 transition-transform duration-300 ease-out"
            style={{
              width: "25%",
              transform: `translateX(${activeIndex * 100}%)`,
            }}
          />
        )}

        {/* Navigation items */}
        <div className="relative grid grid-cols-4 h-16 safe-area-pb">
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/dashboard" && pathname === "/");
            const isPressed = pressedItem === item.name;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onTouchStart={() => setPressedItem(item.name)}
                onTouchEnd={() => setPressedItem(null)}
                onMouseDown={() => setPressedItem(item.name)}
                onMouseUp={() => setPressedItem(null)}
                onMouseLeave={() => setPressedItem(null)}
                className={`
                  flex flex-col items-center justify-center space-y-1 
                  transition-all duration-200 ease-out touch-target
                  relative overflow-hidden
                  ${
                    isActive
                      ? "text-yellow-400"
                      : "text-gray-500 hover:text-gray-300"
                  }
                  ${isPressed ? "scale-95" : "scale-100"}
                `}
              >
                {/* Ripple effect background */}
                <div
                  className={`
                  absolute inset-0 bg-yellow-400/10 rounded-full
                  transition-all duration-300 ease-out
                  ${isPressed ? "scale-150 opacity-100" : "scale-0 opacity-0"}
                `}
                />

                {/* Icon container */}
                <div
                  className={`
                  relative flex items-center justify-center
                  transition-all duration-200 ease-out z-10
                  ${isActive ? "scale-110" : "scale-100"}
                  ${isPressed ? "scale-90" : ""}
                `}
                >
                  <Icon className="w-5 h-5" />

                  {/* Active indicator dot */}
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full">
                      <div className="w-full h-full bg-yellow-400 rounded-full animate-ping opacity-75" />
                    </div>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`
                  text-xs font-medium transition-all duration-200 z-10
                  ${
                    isActive ? "text-yellow-400 font-semibold" : "text-gray-500"
                  }
                  ${isPressed ? "scale-95" : "scale-100"}
                `}
                >
                  {item.name}
                </span>

                {/* Bottom active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-yellow-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Gradient overlay for smooth edges */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed nav */}
      <div className="md:hidden h-16 safe-area-pb" />
    </>
  );
}
