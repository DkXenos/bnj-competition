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
      });

      // Animate the centered text content to fade in
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

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
      squareTl.to(".square-pair-3", { ...commonAnimProps }, 0.4);
      squareTl.to(".square-pair-4", { ...commonAnimProps }, 0.6);

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
      className="relative bg-gradient-to-b from-[#414659] to-white overflow-hidden"
    >
      {/* This container holds the main content and provides scroll space */}
      <div
        ref={heroSectionRef} // Attach the ref to the hero section
        className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-1 w-[35vw] max-w-[500px] h-auto absolute lg:-rotate-148 lg:-left-[15vw] lg:bottom-[30vh] z-9"
          />
          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-2 w-[35vw] max-w-[500px] h-auto absolute lg:rotate-168 lg:-left-[10vw] lg:-bottom-[10vh] z-10"
          />
          <svg
            ref={circleRef}
            width="1318"
            height="1278"
            viewBox="0 0 1318 1278"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[80vw] max-w-[1200px] h-auto absolute lg:left-[10vw] lg:-bottom-[50vh] z-8"
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
            className="square-pair-1 w-[35vw] max-w-[500px] h-auto absolute lg:rotate-168 lg:-right-[15vw] lg:bottom-[30vh] z-9"
          />

          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-2 w-[35vw] max-w-[500px] h-auto absolute lg:-rotate-168 lg:-right-[10vw] lg:-bottom-[10vh] z-10"
          />

          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-3 w-[35vw] max-w-[500px] h-auto absolute lg:rotate-158 lg:-right-[5vw] lg:-bottom-[50vh] z-9"
          />
          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-3 w-[35vw] max-w-[500px] h-auto absolute lg:-rotate-158 lg:-left-[5vw] lg:-bottom-[50vh] z-9"
          />
          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-4 w-[35vw] max-w-[500px] h-auto absolute lg:-rotate-128 lg:-left-[10vw] lg:-bottom-[90vh] z-9"
          />
          <Image
            src="/square.svg"
            alt="Square icon"
            width={100}
            height={100}
            className="square-pair-4 w-[35vw] max-w-[500px] h-auto absolute lg:rotate-128 lg:-right-[10vw] lg:-bottom-[90vh] z-9"
          />
        </div>

        {/* Centered Content with Glassmorphism */}
        <div
          ref={contentRef}
          className="relative z-20 text-center bg-white/10 backdrop-blur-md rounded-xl p-8 md:p-12 border border-white/20 shadow-lg max-w-3xl"
        >
          <h1 className="text-4xl font-bold text-white mb-6">
            Apa itu MentorPact?
          </h1>
          <div className="space-y-4 text-gray-200">
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
        className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 bg-[#FBFBFD]"
      >
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-8 md:p-12 border border-gray-200 shadow-lg max-w-3xl">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Kenapa MentorPact?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl">
            Kami menawarkan bimbingan personal dari mentor ahli, penjadwalan yang fleksibel, dan wawasan dunia nyata untuk mempercepat pertumbuhan karir Anda.
          </p>
        </div>
      </div>

      {/* Ensure enough scroll space for the animation to complete */}
      <div className="h-[500px] bg-white"></div>
    </div>
  );
}