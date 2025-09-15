"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
  FaTimes,
} from "react-icons/fa";

interface RecipeImageGalleryProps {
  images: string[];
  title: string;
}

export default function RecipeImageGallery({
  images,
  title,
}: RecipeImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // Handle fallback if images array is empty
  if (!images.length) {
    return (
      <div className="relative h-48 md:h-64 lg:h-80 w-full bg-gray-700 rounded-xl overflow-hidden flex items-center justify-center">
        <span className="text-gray-400">{title}</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative h-48 md:h-64 lg:h-80 w-full rounded-xl overflow-hidden">
        {images.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentImage
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={src}
              alt={`${title} - image ${index + 1}`}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1024px"
              priority={index === 0}
            />
          </div>
        ))}

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full h-10 w-10 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full h-10 w-10 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        {/* Fullscreen button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-3 right-3 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full h-8 w-8 flex items-center justify-center text-white transition-colors z-10"
          aria-label="View fullscreen"
        >
          <FaExpand className="h-3 w-3" />
        </button>

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage(index);
                }}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentImage
                    ? "bg-yellow-500"
                    : "bg-white bg-opacity-50"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail row */}
      {images.length > 1 && (
        <div className="flex mt-2 space-x-2 overflow-x-auto no-scrollbar">
          {images.map((src, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden transition-opacity ${
                index === currentImage
                  ? "ring-2 ring-yellow-500"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen modal */}
      {fullscreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={toggleFullscreen}
        >
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full h-10 w-10 flex items-center justify-center text-white transition-colors z-10"
            aria-label="Close fullscreen"
          >
            <FaTimes />
          </button>

          <div className="relative h-screen w-screen md:h-[80vh] md:w-auto md:max-w-[90vw] flex items-center justify-center">
            <Image
              src={images[currentImage]}
              alt={`${title} - fullscreen view`}
              fill
              style={{ objectFit: "contain" }}
              sizes="100vw"
              priority
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full h-12 w-12 flex items-center justify-center text-white transition-colors z-10"
                  aria-label="Previous image"
                >
                  <FaChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full h-12 w-12 flex items-center justify-center text-white transition-colors z-10"
                  aria-label="Next image"
                >
                  <FaChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3 z-10">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImage(index);
                      }}
                      className={`h-3 w-3 rounded-full transition-colors ${
                        index === currentImage
                          ? "bg-yellow-500"
                          : "bg-white bg-opacity-50"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Custom styles */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}
