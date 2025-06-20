"use client";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const quickLinksRef = useRef<HTMLDivElement>(null);
  const supportRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial state - hide all elements
      gsap.set(
        [
          brandRef.current,
          quickLinksRef.current,
          supportRef.current,
          bottomRef.current,
        ],
        {
          opacity: 0,
          y: 50,
        }
      );

      // Create main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate sections in sequence
      tl.to(brandRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      })
        .to(
          [quickLinksRef.current, supportRef.current],
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.2,
          },
          "-=0.4"
        )
        .to(
          bottomRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.2"
        );

      // Add hover animations for links
      const links = footerRef.current?.querySelectorAll("a");
      links?.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out",
          });
        });

        link.addEventListener("mouseleave", () => {
          gsap.to(link, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        });
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  // Logo hover animation
  const handleLogoHover = (isEntering: boolean) => {
    const logo = brandRef.current?.querySelector("img");
    if (logo) {
      gsap.to(logo, {
        rotation: isEntering ? 10 : 0,
        scale: isEntering ? 1.1 : 1,
        duration: 0.1,
        ease: "power2.out",
      });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gradient-to-b from-white to-sky-100 text-black overflow-hidden"
    >
      <div className="w-[70%] container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 md:mb-12">
          {/* Brand Section */}
          <div ref={brandRef} className="md:col-span-2">
            <div
              className="flex items-center gap-3 mb-4 md:mb-6 cursor-pointer justify-center md:justify-start"
              onMouseEnter={() => handleLogoHover(true)}
              onMouseLeave={() => handleLogoHover(false)}
            >
              <Image
                src="/MP-logo.svg"
                alt="MentorPact Logo"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain transition-transform duration-300"
              />
              <h2 className="text-xl sm:text-2xl font-bold text-black">
                MentorPact
              </h2>
            </div>
            <p className="text-black leading-relaxed text-sm sm:text-base max-w-md mb-4 md:mb-6 text-center md:text-left mx-auto md:mx-0">
              Menghubungkan para pelajar yang bersemangat dengan mentor
              berpengalaman untuk membuka potensi dan mempercepat pertumbuhan.
              Membangun hubungan bermakna yang mengubah karir dan kehidupan.
            </p>
          </div>

          {/* Quick Links Section */}
          <div ref={quickLinksRef} className="flex justify-center md:justify-end">
            <div className="text-center md:text-left">
              <h3 className="text-base sm:text-lg font-semibold mb-4 md:mb-6 relative">
                Tautan Cepat
                <div className="absolute bottom-0 left-1/2 md:left-0 transform -translate-x-1/2 md:translate-x-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                {[
                  { href: "/", label: "Beranda" },
                  { href: "/explore", label: "Cari Mentor" },
                  { href: "/about", label: "Tentang Kami" },
                  { href: "/register-mentor", label: "Jadi Mentor" },
                ].map((link, index) => (
                  <li
                    key={link.href}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link
                      href={link.href}
                      className="text-black text-sm sm:text-base hover:text-blue-600 transition-all duration-300 relative group inline-block"
                    >
                      <span className="relative z-10">{link.label}</span>
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div ref={bottomRef} className="border-t border-gray-300 pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 order-2 md:order-1">
              <p className="text-gray-600 text-xs sm:text-sm transition-colors duration-300 hover:text-gray-800 text-center md:text-left">
                © 2024 MentorPact.
              </p>
            </div>

            <div className="flex items-center gap-6 text-xs sm:text-sm text-gray-600 order-1 md:order-2">
              <span className="flex items-center gap-2 transition-all duration-300 hover:text-gray-800 hover:scale-105">
                <span className="hover:font-medium transition-all duration-300 text-center">
                  Dibuat oleh Tim BnJ
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
