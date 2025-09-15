/**
 * Utilities for handling image uploads and processing
 */

export interface ImageValidationResult {
  isValid: boolean;
  message: string;
  imageData?: string;
}

/**
 * Maximum file size in bytes (5MB)
 */
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Allowed image mime types
 */
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

/**
 * Validates and processes an image file
 * @param file The image file to validate and process
 * @returns Promise resolving to validation result with base64 data if valid
 */
export const validateAndProcessImage = (
  file: File
): Promise<ImageValidationResult> => {
  return new Promise((resolve) => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      resolve({
        isValid: false,
        message: `File size exceeds the 5MB limit. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(2)}MB.`,
      });
      return;
    }

    // Check file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      resolve({
        isValid: false,
        message: `File type not supported. Allowed types: JPEG, PNG, GIF, WebP.`,
      });
      return;
    }

    // Process the file
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        // Successfully processed image
        resolve({
          isValid: true,
          message: "Image validated successfully.",
          imageData: e.target.result as string,
        });
      } else {
        resolve({
          isValid: false,
          message: "Failed to read image file.",
        });
      }
    };

    reader.onerror = () => {
      resolve({
        isValid: false,
        message: "Error reading file: " + reader.error?.message,
      });
    };

    // Read the file as data URL (base64)
    reader.readAsDataURL(file);
  });
};

/**
 * Compress an image to reduce file size
 * @param imageData Base64 image data
 * @param quality Compression quality (0-1)
 * @param maxWidth Maximum width in pixels
 * @returns Promise resolving to compressed image data
 */
export const compressImage = (
  imageData: string,
  quality = 0.8,
  maxWidth = 1200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageData;

    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");

      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        const ratio = maxWidth / width;
        width = maxWidth;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw the image on canvas
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      // Get the compressed image data
      const compressedImageData = canvas.toDataURL("image/jpeg", quality);

      resolve(compressedImageData);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for compression"));
    };
  });
};
