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
        duration: 0.8,
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
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gradient-to-b from-white to-sky-100 text-black overflow-hidden"
    >
      <div className="container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Brand Section */}
          <div ref={brandRef} className="md:col-span-2">
            <div
              className="flex items-center gap-3 mb-6 cursor-pointer"
              onMouseEnter={() => handleLogoHover(true)}
              onMouseLeave={() => handleLogoHover(false)}
            >
              <Image
                src="/MP-logo.svg"
                alt="MentorPact Logo"
                width={48}
                height={48}
                className="w-12 h-12 object-contain transition-transform duration-300"
              />
              <h2 className="text-2xl font-bold text-black">MentorPact</h2>
            </div>
            <p className="text-black leading-relaxed max-w-md mb-6">
              Menghubungkan para pelajar yang bersemangat dengan mentor
              berpengalaman untuk membuka potensi dan mempercepat pertumbuhan.
              Membangun hubungan bermakna yang mengubah karir dan kehidupan.
            </p>

            {/* <div className="flex space-x-4">
              {[
                {
                  platform: "Twitter",
                  color: "hover:bg-blue-400",
                  path: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
                },
                {
                  platform: "Facebook",
                  color: "hover:bg-blue-600",
                  path: "M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z",
                },
                {
                  platform: "Instagram",
                  color: "hover:bg-pink-500",
                  path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.191.085.313-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.074-1.378l.548-2.071c.414-1.577.548-1.977.548-1.977s-.142-.284-.142-.7c0-.655.38-1.136.853-1.136.402 0 .596.302.596.663 0 .403-.257 1.008-.389 1.566-.094.399.2.724.595.724.758 0 1.343-.799 1.343-1.95 0-1.022-.734-1.738-1.781-1.738-1.214 0-1.927.909-1.927 1.849 0 .365.141.756.316 1.069.035.042.04.08.03.123-.033.139-.106.434-.121.495-.019.08-.062.097-.143.059-.799-.372-1.301-1.539-1.301-2.481 0-2.015 1.461-3.864 4.214-3.864 2.21 0 3.93 1.574 3.93 3.68 0 2.197-1.385 3.965-3.309 3.965-.645 0-1.253-.335-1.46-.735 0 0-.319 1.215-.397 1.511-.144.556-.533 1.253-.794 1.679.598.185 1.235.283 1.888.283 6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z",
                },
                {
                  platform: "LinkedIn",
                  color: "hover:bg-blue-700",
                  path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                },
              ].map((social, index) => (
                <a
                  key={social.platform}
                  href="#"
                  className={`w-10 h-10 bg-gray-100 ${social.color} rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <svg
                    className="w-5 h-5 text-gray-600 hover:text-white transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div> */}
          </div>

          <div ref={quickLinksRef} className="flex justify-end">
            <div>
              <h3 className="text-lg font-semibold mb-6 relative">
                Tautan Cepat
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></div>
              </h3>
              <ul className="space-y-3">
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
                      className="text-black hover:text-blue-600 transition-all duration-300 relative group inline-block"
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
        <div ref={bottomRef} className="border-t border-gray-300 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <p className="text-gray-600 text-sm transition-colors duration-300 hover:text-gray-800">
                © 2024 MentorPact.
              </p>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <span className="flex items-center gap-2 transition-all duration-300 hover:text-gray-800 hover:scale-105">
                <span className="hover:font-medium transition-all duration-300">
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
