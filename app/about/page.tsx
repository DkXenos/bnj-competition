// AboutPage.tsx
"use client";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGSVGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const whyUsRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Create a timeline for the circle animations, pinning the hero section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "top top",
          end: "+=1000",
          scrub: true,
          pin: true,
        },
      });

      tl.to(circleRef.current, {
        rotation: 180,
        scale: 1.8,
        ease: "none",
      }).to(
        contentRef.current,
        {
          yPercent: -150,
          opacity: 0,
          ease: "power1.in",
        },
        0
      );

      // Animate squares to fall in a paired cascade
      const squareTl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "+=1500",
          scrub: true,
        },
      });

      const commonAnimProps = {
        y: "120vh",
        rotation: gsap.utils.random(-90, 90),
        opacity: 0,
        ease: "power1.in",
      };

      squareTl.to(".square-pair-1", { ...commonAnimProps }, 0);
      squareTl.to(".square-pair-2", { ...commonAnimProps }, 0.2);
      squareTl.to(".square-pair-3", { ...commonAnimProps, rotation: -360 }, 0.3);
      squareTl.to(".square-pair-3-left", { ...commonAnimProps, rotation: 360 }, 0.3);
      squareTl.to(".square-pair-4", { ...commonAnimProps }, 0.5);

      // "Why Us" Section Animation
      gsap.from(whyUsRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: whyUsRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });
    }, mainRef);

    return () => ctx.revert(); // Cleanup animations
  }, []);

  return (
    <div
      ref={mainRef}
      className="relative bg-gradient-to-b from-[#414659] to-white overflow-hidden min-h-screen"
    >
      {/* This container holds the main content and provides scroll space */}
      <div
        ref={heroSectionRef}
        className="relative min-h-[100vh] md:min-h-screen px-4 md:px-8 overflow-hidden flex items-center"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-1 w-[55vw] bottom-[35vh] -left-[40vw] md:w-[40vw] md:bottom-[15vh] md:-left-[15vw] 
            h-auto absolute -rotate-[45deg] lg:-left-[10vw] lg:bottom-[20vh] z-9"
          />
          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-1 w-[55vw] bottom-[35vh] -right-[40vw] md:w-[40vw] md:bottom-[15vh] md:-right-[15vw] 
            h-auto absolute rotate-[45deg] lg:-right-[10vw] lg:bottom-[20vh] z-9"
          />

          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-2 w-[55vw] bottom-[15vh] -right-[25vw] md:-bottom-[20vh] md:-right-[25vw] 
            h-auto absolute rotate-[168deg] lg:-right-[15vw] lg:-bottom-[30vh] z-10"
          />

          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-2 w-[55vw] bottom-[15vh] -left-[25vw] md:w-[40vw] md:-bottom-[20vh] md:-left-[25vw] 
            h-auto absolute -rotate-[168deg] lg:-left-[15vw] lg:-bottom-[30vh] z-10"
          />
          
          <svg
            ref={circleRef}
            width="1318"
            height="1278"
            viewBox="0 0 1318 1278"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[130vw] -bottom-[5vh] -left-[16vw] md:w-[90vw] md:-bottom-[50vh] md:left-[5vw]
            h-auto absolute lg:w-[70vw] lg:left-[15vw] lg:-bottom-[50vh] z-8"
          >
            <circle
              cx="659"
              cy="639"
              r="639"
              fill="url(#paint0_linear_38_19)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_38_19"
                x1="658.968"
                y1="0.146973"
                x2="658.968"
                y2="1317.79"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#414659" />
                <stop offset="1" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>

          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-3 w-[55vw] -bottom-[5vh] -right-[20vw] lg:w-[35vw] md:w-[40vw] md:-bottom-[50vh] md:-right-[15vw] 
            h-auto absolute -rotate-[30deg] lg:-rotate-48 lg:-right-[5vw] lg:-bottom-[50vh] z-10"
          />
          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-3-left w-[55vw] -bottom-[5vh] -left-[20vw] lg:w-[35vw] md:w-[40vw] md:-bottom-[50vh] md:-left-[15vw] 
            h-auto absolute rotate-[30deg] lg:rotate-48 lg:-left-[5vw] lg:-bottom-[50vh] z-10"
          />
          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-4 w-[55vw] -bottom-[10vh] -left-[15vw] md:w-[0vw] md:bottom-[60vh] md:-left-[5vw] 
            h-auto absolute -rotate-[128deg] lg:-left-[5vw] lg:-bottom-[90vh] z-9"
          />
          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-4 w-[55vw] -bottom-[10vh] -right-[15vw] md:w-[0vw] md:bottom-[60vh] md:-right-[5vw] 
            h-auto absolute rotate-[128deg] lg:-right-[5vw] lg:-bottom-[90vh] z-9"
          />
        </div>

        {/* Centered Content with Glassmorphism */}
        <div
          ref={contentRef}
          className="absolute top-[50vh] left-1/2 w-[90vw] max-w-[85vw] md:w-full md:max-w-2xl md:max-w-3xl -translate-x-1/2 -translate-y-1/2 z-20 text-center bg-grey/15 backdrop-blur-md rounded-xl p-6 md:p-6 lg:p-12 border border-white/20 shadow-lg"
        >
          <h1 className="text-lg md:text-2xl lg:text-4xl font-bold text-white mb-3 md:mb-6">
            Apa itu MentorPact?
          </h1>
          <div className="space-y-2 md:space-y-4 text-gray-200 text-xs md:text-base lg:text-lg max-h-[60vh] overflow-y-auto">
            <p>
              MentorPact adalah platform pembelajaran dinamis yang dirancang untuk menjembatani kesenjangan antara ambisi dan keahlian. Kami percaya bahwa bimbingan yang tepat dapat membawa perubahan besar, oleh karena itu kami menciptakan ruang khusus bagi individu untuk terhubung dengan mentor berpengalaman di berbagai bidang. Misi kami adalah membuat bimbingan pribadi dapat diakses oleh semua orang, memberdayakan para pembelajar untuk mempercepat pertumbuhan mereka dan mencapai tujuan mereka.
            </p>
            <p>
              Bagi mentee, MentorPact menawarkan kesempatan unik untuk menerima bimbingan satu-satu, mendapatkan wawasan dunia nyata, dan membangun jaringan profesional. Bagi mentor, ini adalah kesempatan untuk memberi kembali, berbagi pengalaman berharga, dan membentuk para pemimpin masa depan di industri mereka.
            </p>
            <p>
              Bergabunglah dengan kami dalam membuat perjanjian untuk kemajuan. Baik Anda mencari pengetahuan atau ingin membagikannya, MentorPact adalah tempat perjalanan Anda dimulai.
            </p>
          </div>
        </div>
      </div>

      {/* Why Us Section */}
      <div
        ref={whyUsRef}
        className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-4 md:px-8 bg-sky-100"
      >
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-4 md:p-12 border border-gray-200 shadow-lg w-[90vw] md:w-full max-w-2xl md:max-w-3xl">
          <h2 className="text-xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
            Kenapa MentorPact?
          </h2>
          <p className="text-sm md:text-xl text-gray-600 max-w-2xl mx-auto">
            Kami menawarkan bimbingan personal dari mentor ahli, penjadwalan yang fleksibel, dan wawasan dunia nyata untuk mempercepat pertumbuhan Anda.
          </p>
        </div>
      </div>
    </div>
  );
}