"use client";
import { useEffect, useState, useRef } from "react";
import { IMentor } from "@/types/mentor.md";
import { IUser } from "@/types/user.md";
// import { GetAllMentors } from "@/lib/get-mentor";
import supabase from "@/lib/db";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

function MentorCard({ mentor, index }: { mentor: IMentor; index: number }) {
  const router = useRouter();
  const [mentorUser, setMentorUser] = useState<IUser | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMentorUser = async () => {
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", mentor.user_id)
        .single();
      
      if (userData) {
        setMentorUser(userData);
      }
    };
    
    fetchMentorUser();
  }, [mentor.user_id]);

  useEffect(() => {
    if (cardRef.current) {
      // Set initial state
      gsap.set(cardRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.9,
      });

      // Animate on scroll
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        delay: index * 0.2, // Stagger animation based on index
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Hover animations
      const handleMouseEnter = () => {
        gsap.to(cardRef.current, {
          y: -10,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const cardElement = cardRef.current;
      cardElement.addEventListener("mouseenter", handleMouseEnter);
      cardElement.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        cardElement.removeEventListener("mouseenter", handleMouseEnter);
        cardElement.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [index]);

  const handleMentorClick = () => {
    // Add click animation before navigation
    gsap.to(cardRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.inOut",
      onComplete: () => {
        router.push(`/mentor_detail/${mentor.id}`);
      },
    });
  };

  return (
    <div 
      ref={cardRef}
      onClick={handleMentorClick}
      className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col cursor-pointer transition-shadow duration-200 min-h-[400px]"
    >
      {/* Profile Image Placeholder */}
      <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      
      {/* Mentor Info */}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {mentorUser?.username
            ?.split(" ")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3">
          {mentor.deskripsi
            .split(" ")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")}
        </p>
      </div>
      
      {/* Additional Info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span><i className="bi bi-star-fill mr-2 text-amber-300"></i>Rating: {mentor.total_rating}/5</span>
          <span><i className="bi bi-wallet2 mr-2"></i>Rp {mentor.harga_per_sesi.toLocaleString()}/Sesi</span>
        </div>
      </div>
    </div>
  );
}

export default function MentorSection() {
  const router = useRouter();
  const [mentors, setMentors] = useState<IMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        // Fetch mentors with is_confirmed = true
        const { data: mentorData, error } = await supabase
          .from("mentors")
          .select("*")
          .eq("is_confirmed", true);

        if (error) {
          console.error("Error fetching mentors:", error);
          return;
        }

        setMentors(mentorData.slice(0, 3)); // Limit to 3 mentors
      } catch (error) {
        console.error("Unexpected error fetching mentors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  useEffect(() => {
    if (!loading && headerRef.current && buttonRef.current) {
      // Animate header
      gsap.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Animate button
      gsap.fromTo(
        buttonRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: buttonRef.current,
            start: "top 90%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Button hover animation
      const handleButtonHover = () => {
        gsap.to(buttonRef.current, {
          scale: 1.05,
          duration: 0.2,
          ease: "power2.out",
        });
      };

      const handleButtonLeave = () => {
        gsap.to(buttonRef.current, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      };

      const buttonElement = buttonRef.current;
      buttonElement.addEventListener("mouseenter", handleButtonHover);
      buttonElement.addEventListener("mouseleave", handleButtonLeave);

      return () => {
        buttonElement.removeEventListener("mouseenter", handleButtonHover);
        buttonElement.removeEventListener("mouseleave", handleButtonLeave);
      };
    }
  }, [loading]);

  const handleButtonClick = () => {
    gsap.to(buttonRef.current, {
      scale: 0.95,
      duration: 0.1,
      ease: "power2.inOut",
      onComplete: () => {
        router.push("/explore");
      },
    });
  };

  if (loading) {
    return (
      <div className="w-full py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-4xl text-center font-bold text-black mb-4">
              Mentor - Mentor Kami!
            </h2>
            <p className="text-xl text-center text-gray-600">
              Sedang memuat mentor kami, harap tunggu sebentar...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="w-full py-12 px-6">
      <div className="max-w-[70%] mx-auto">
        {/* Section Header */}
        <div ref={headerRef} className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">
            Mentor - Mentor Kami!
          </h2>
          <p className="text-xl text-gray-600">
            Temukan mentor yang tepat untuk membantu Anda mencapai tujuan belajar Anda.
          </p>
        </div>

        {/* Mentor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {mentors.map((mentor, index) => (
            <MentorCard key={mentor.id} mentor={mentor} index={index} />
          ))}
        </div>

        {/* Show All Button */}
        <div className="flex justify-center">
          <button
            ref={buttonRef}
            onClick={handleButtonClick}
            className="px-6 bg-white py-3 text-gray-700 shadow-lg rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Tampilkan Semua
          </button>
        </div>
      </div>
    </div>
  );
}