"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface EvidenceSectionProps {
  buktiMasalah: string[];
}

export default function EvidenceSection({ buktiMasalah }: EvidenceSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const openImagePopup = (imageUrl: string, index: number) => {
    setSelectedImage(imageUrl);
    setSelectedImageIndex(index);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (selectedImageIndex + 1) % buktiMasalah.length
      : (selectedImageIndex - 1 + buktiMasalah.length) % buktiMasalah.length;
    
    setSelectedImageIndex(newIndex);
    setSelectedImage(buktiMasalah[newIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeImagePopup();
    } else if (e.key === 'ArrowLeft') {
      navigateImage('prev');
    } else if (e.key === 'ArrowRight') {
      navigateImage('next');
    }
  };

  return (
    <>
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <i className="bi bi-camera text-slate-600"></i>
          Bukti Masalah
          <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
            {buktiMasalah.length} Gambar
          </span>
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {buktiMasalah.map((url: string, idx: number) => (
            <div key={idx} className="group relative">
              <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-slate-300 transition-colors relative cursor-pointer">
                <Image
                  src={url}
                  alt={`Bukti Masalah ${idx + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onClick={() => openImagePopup(url, idx)}
                />
                
                {/* Clickable Image overlay */}
                <div 
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer"
                  onClick={() => openImagePopup(url, idx)}
                >
                  <div className="opacity-0 group-hover:opacity-100 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium transition-opacity flex items-center gap-1">
                    <i className="bi bi-zoom-in"></i>
                    <span>Lihat</span>
                  </div>
                </div>
                
                {/* Image number */}
                <div className="absolute top-2 left-2 bg-slate-800 text-white text-xs px-2 py-1 rounded-full font-medium pointer-events-none">
                  {idx + 1}
                </div>
              </div>
              
              <p className="mt-2 text-sm text-gray-600 text-center">
                Bukti {idx + 1}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeImagePopup}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeImagePopup}
              className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <i className="bi bi-x-lg text-lg"></i>
            </button>

            {/* Navigation Buttons */}
            {buktiMasalah.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-4 z-10 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
                >
                  <i className="bi bi-chevron-left text-xl"></i>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-4 z-10 bg-black/50 text-white rounded-full p-3 hover:bg-black/70 transition-colors"
                >
                  <i className="bi bi-chevron-right text-xl"></i>
                </button>
              </>
            )}

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {buktiMasalah.length}
            </div>

            {/* Main Image */}
            <div 
              className="relative w-full h-full flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage}
                alt={`Bukti Masalah ${selectedImageIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                quality={95}
              />
            </div>

            {/* Download Button */}
            <Link
              href={selectedImage}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 z-10 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="bi bi-download text-lg"></i>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}