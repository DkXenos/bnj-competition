"use client";
import { useEffect } from "react";
import { gsap } from "gsap";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  spinnerSize?: "sm" | "md" | "lg";
  overlay?: boolean;
  animationType?: "pulse" | "spin" | "both" | "none";
  logoAnimation?: boolean; // Keeping for backward compatibility
}

export default function LoadingScreen({
  message = "Sedang memuat...",
  fullScreen = true,
  spinnerSize = "md",
  overlay = true,
  animationType = "pulse",
  logoAnimation = true,
}: LoadingScreenProps) {
  // Size mapping for spinner
  const sizeMap = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  // For backward compatibility
  const effectiveAnimationType = logoAnimation ? animationType : "none";

  // GSAP animations for logo
  useEffect(() => {
    if (effectiveAnimationType === "none") return;

    const ctx = gsap.context(() => {
      // Pulse animation
      if (
        effectiveAnimationType === "pulse" ||
        effectiveAnimationType === "both"
      ) {
        gsap.to(".logo-pulse", {
          scale: 1.1,
          duration: 0.8,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      }

      // Spin animation
      if (
        effectiveAnimationType === "spin" ||
        effectiveAnimationType === "both"
      ) {
        gsap.to(".logo-spin", {
          rotation: 360,
          duration: 2,
          repeat: -1,
          ease: "linear",
        });
      }
    });

    return () => ctx.revert();
  }, [effectiveAnimationType]);

  // Determine which animation classes to apply
  const getLogoClasses = () => {
    const classes = [];
    if (
      effectiveAnimationType === "pulse" ||
      effectiveAnimationType === "both"
    ) {
      classes.push("logo-pulse");
    }
    if (
      effectiveAnimationType === "spin" ||
      effectiveAnimationType === "both"
    ) {
      classes.push("logo-spin");
    }
    return classes.join(" ");
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        overlay ? "bg-sky-100/95 backdrop-blur-sm" : "bg-sky-100"
      } ${
        fullScreen
          ? "fixed inset-0 z-50"
          : "w-full h-full min-h-[300px] rounded-lg"
      }`}
    >
      <div className="flex bg-white rounded-lg p-4 shadow-lg flex-col items-center justify-center gap-4">
        {effectiveAnimationType !== "none" ? (
          <div className={getLogoClasses()}>
            <img
              src="/MP-logo.svg"
              alt="MentorPact Logo"
              className="h-14 w-14 ml-3 mt-6 flex items-center justify-center object-contain"
            />
          </div>
        ) : (
          <div
            className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeMap[spinnerSize]}`}
          ></div>
        )}
        <div className="text-center">
          <p className={`font-medium text-gray-700 mt-4`}>{message}</p>
        </div>
      </div>
    </div>
  );
}