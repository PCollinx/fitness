"use client";

import React, { useRef } from 'react';
import { FaCamera, FaUser } from 'react-icons/fa';

interface ProfileImageUploadProps {
  image: string | null;
  tempImage: string | null;
  isEditing: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userName: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  image,
  tempImage,
  isEditing,
  onUpload,
  userName
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative flex justify-center">
      <div className="relative">
        {/* Profile Image */}
        {(image || tempImage) ? (
          <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-gray-900">
            <img 
              src={tempImage || image || '/default-avatar.png'} 
              alt={userName}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="h-32 w-32 rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-900">
            <FaUser className="h-16 w-16 text-gray-500" />
          </div>
        )}
        
        {/* Upload Button */}
        {isEditing && (
          <button 
            onClick={triggerFileInput}
            className="absolute bottom-0 right-0 bg-yellow-500 text-black p-2 rounded-full hover:bg-yellow-400 transition-colors shadow-lg"
            aria-label="Upload profile picture"
          >
            <FaCamera />
          </button>
        )}
        
        {/* Hidden File Input */}
        <input 
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={onUpload}
        />
      </div>
    </div>
  );
};

export default ProfileImageUpload;