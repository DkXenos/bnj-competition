"use client";
import { useState } from "react";
import Image from "next/image";
import { IUser } from "@/types/user.md";

// Sample user data - replace with your actual backend data later
const sampleUsers: IUser[] = [
  {
    id: 1,
    username: "Claire",
    email: "claire@gmail.com",
    no_telpon: "+1234567890",
    password: "", // Don't display passwords
    tanggal_join: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    username: "Brandon",
    email: "brandon@gmail.com", 
    no_telpon: "+1234567891",
    password: "",
    tanggal_join: "2024-01-16T14:20:00Z"
  },
  {
    id: 3,
    username: "Tjoh Anna San",
    email: "Tjoh@gmail.com",
    no_telpon: "+1234567892", 
    password: "",
    tanggal_join: "2024-01-17T09:15:00Z"
  }
];

// Avatar mapping - you can store these URLs in your database later
const avatarMap: { [key: number]: string } = {
  1: "/mentor-1.jpg",
  2: "/avatars/bryan.jpg", 
  3: "/avatars/nicho.jpg",
};

export default function Carousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users] = useState<IUser[]>(sampleUsers);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? users.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === users.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentUser = users[currentIndex];
  const currentAvatar = avatarMap[currentUser?.id];
  const hasImageError = imageErrors[currentUser?.id];

  const handleImageError = (userId: number) => {
    setImageErrors(prev => ({ ...prev, [userId]: true }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="relative w-full h-96 bg-gradient-to-br flex items-center justify-center from-gray-50 to-gray-100 rounded-lg overflow-hidden shadow-lg">
      {/* Carousel Content */}
      <div className="w-[90%] h-full bg-sky-100">
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="text-center">
            {/* Profile Avatar with Image */}
            <div className="mb-4">
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto overflow-hidden">
                {currentAvatar && !hasImageError ? (
                  <Image
                    src={currentAvatar}
                    alt={`${currentUser?.username} avatar`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(currentUser?.id)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            {/* User Info */}
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentUser?.username}
            </h2>
        
            <div className="space-y-2 mb-4">
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {currentUser?.email}
              </p>
        
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {currentUser?.no_telpon}
              </p>
            </div>
            {/* Join Date */}
            <p className="text-sm text-gray-500">
              Bergabung sejak {formatDate(currentUser?.tanggal_join)}
            </p>
          </div>
        </div>
        {/* Previous Button */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Previous user"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        {/* Next Button */}
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          aria-label="Next user"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        {/* Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {users.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-white"
                  : "bg-gray-400 hover:bg-gray-300"
              }`}
              aria-label={`Go to user ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}