"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { IUser } from "@/types/user.md";
import { gsap } from "gsap";

// Sample user data with descriptions/specialties
const sampleUsers: IUser[] = [
	{
		id: 1,
		username: "Claire Rivers",
		email: "claire@gmail.com",
		no_telpon: "+1234567890",
		password: "",
		tanggal_join: "2024-01-15T10:30:00Z",
		isMentor: true,
		profile_image: "/mentor-1.jpg", // Example of a user with a profile image
		isAdmin: false, // Assuming this field is part of IUser
	},
	{
		id: 2,
		username: "Brandon",
		email: "brandon@gmail.com",
		no_telpon: "+1234567891",
		password: "",
		tanggal_join: "2024-01-16T14:20:00Z",
		isMentor: true,
		profile_image: "/mentor-2.jpg", // Example of a user with a profile image
		isAdmin: false, // Assuming this field is part of IUser
	},
	{
		id: 3,
		username: "Tjoh Anna San",
		email: "Tjoh@gmail.com",
		no_telpon: "+1234567892",
		password: "",
		tanggal_join: "2024-01-17T09:15:00Z",
		isMentor: true,
		profile_image: null, // Example of a user without a profile image
		isAdmin: false, // Assuming this field is part of IUser
	},
];

// Avatar mapping
const avatarMap: { [key: number]: string } = {
	1: "/mentor-1.jpg",
	2: "/mentor-2.jpg",
	3: "/mentor-3.jpg",
};

// User descriptions/testimonials
const userDescriptions: { [key: number]: string } = {
	1: "Platform ini sangat membantu saya dalam menemukan mentor yang tepat. Pengalaman belajar yang luar biasa!",
	2: "Mentoring sessions di sini benar-benar mengubah karir saya. Sangat direkomendasikan untuk semua yang ingin berkembang.",
	3: "Sistem mentoring yang terstruktur dan mentor-mentor yang berpengalaman. Investasi terbaik untuk masa depan!",
};

export default function Carousel() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [users] = useState<IUser[]>(sampleUsers);
	const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});
	const [isPaused, setIsPaused] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	// Refs for animations
	const avatarRef = useRef<HTMLDivElement | null>(null);
	const nameRef = useRef<HTMLHeadingElement | null>(null);
	const descriptionRef = useRef<HTMLDivElement | null>(null);
	const contactInfoRef = useRef<HTMLDivElement | null>(null);
	const dotsRef = useRef<HTMLDivElement | null>(null);

	// Auto-scroll effect
	useEffect(() => {
		if (isPaused || isTransitioning) return;

		const interval = setInterval(() => {
			goToNext();
		}, 2000);

		return () => clearInterval(interval);
	}, [isPaused, isTransitioning, currentIndex]);

	// Initial load animation
	useEffect(() => {
		const tl = gsap.timeline();

		// Set initial states
		gsap.set(
			[avatarRef.current, nameRef.current, descriptionRef.current, contactInfoRef.current],
			{
				opacity: 0,
				y: 50,
			}
		);

		gsap.set(dotsRef.current, {
			opacity: 0,
			y: 20,
		});

		// Animate in sequence
		tl.to(avatarRef.current, {
			opacity: 1,
			y: 0,
			duration: 0.8,
			ease: "back.out(1.7)",
		})
			.to(
				nameRef.current,
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.4"
			)
			.to(
				descriptionRef.current,
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.3"
			)
			.to(
				contactInfoRef.current,
				{
					opacity: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
				},
				"-=0.3"
			)
			.to(dotsRef.current, {
				opacity: 1,
				y: 0,
				duration: 0.5,
				ease: "power2.out",
			})
			// .to([prevButtonRef.current, nextButtonRef.current], {
			//   opacity: 1,
			//   scale: 1,
			//   duration: 0.5,
			//   ease: "back.out(1.7)",
			//   stagger: 0.1,
			// }, "-=0.3")
			// .to(dotsRef.current, {
			//   opacity: 1,
			//   y: 0,
			//   duration: 0.5,
			//   ease: "power2.out",
			// }, "-=0.2");
	}, []);

	// Slide transition animation
	const animateSlideTransition = (direction: "next" | "prev") => {
		if (isTransitioning) return;

		setIsTransitioning(true);
		const tl = gsap.timeline();

		// Exit animation
		tl.to([avatarRef.current, nameRef.current], {
			opacity: 0,
			x: direction === "next" ? -50 : 50,
			duration: 0.3,
			ease: "power2.in",
		})
			.to(
				[descriptionRef.current, contactInfoRef.current],
				{
					opacity: 0,
					x: direction === "next" ? -30 : 30,
					duration: 0.3,
					ease: "power2.in",
				},
				"-=0.2"
			)
			.call(() => {
				// Update index here
				if (direction === "next") {
					setCurrentIndex((prevIndex) =>
						prevIndex === users.length - 1 ? 0 : prevIndex + 1
					);
				} else {
					setCurrentIndex((prevIndex) =>
						prevIndex === 0 ? users.length - 1 : prevIndex - 1
					);
				}
			})
			.set(
				[avatarRef.current, nameRef.current, descriptionRef.current, contactInfoRef.current],
				{
					x: direction === "next" ? 50 : -50,
				}
			)
			// Enter animation
			.to([avatarRef.current, nameRef.current], {
				opacity: 1,
				x: 0,
				duration: 0.4,
				ease: "power2.out",
				stagger: 0.1,
			})
			.to(
				[descriptionRef.current, contactInfoRef.current],
				{
					opacity: 1,
					x: 0,
					duration: 0.4,
					ease: "power2.out",
					stagger: 0.1,
				},
				"-=0.2"
			)
			.call(() => {
				setIsTransitioning(false);
			});
	};

	const goToNext = useCallback(() => {
		animateSlideTransition("next");
	}, [animateSlideTransition]);

	const goToSlide = (index: number) => {
		if (index === currentIndex || isTransitioning) return;

		setIsTransitioning(true);
		const tl = gsap.timeline();

		// Quick fade transition for direct navigation
		tl.to(
			[avatarRef.current, nameRef.current, descriptionRef.current, contactInfoRef.current],
			{
				opacity: 0,
				scale: 0.9,
				duration: 0.3,
				ease: "power2.in",
			}
		)
			.call(() => {
				setCurrentIndex(index);
			})
			.set(
				[avatarRef.current, nameRef.current, descriptionRef.current, contactInfoRef.current],
				{
					scale: 1.1,
				}
			)
			.to(
				[avatarRef.current, nameRef.current, descriptionRef.current, contactInfoRef.current],
				{
					opacity: 1,
					scale: 1,
					duration: 0.4,
					ease: "back.out(1.7)",
					stagger: 0.05,
				}
			)
			.call(() => {
				setIsTransitioning(false);
			});
	};

	const handleMouseEnter = () => {
		setIsPaused(true);
		// Subtle hover effect on container
		gsap.to(avatarRef.current, {
			scale: 1.05,
			duration: 0.3,
			ease: "power2.out",
		});
	};

	const handleMouseLeave = () => {
		setIsPaused(false);
		gsap.to(avatarRef.current, {
			scale: 1,
			duration: 0.3,
			ease: "power2.out",
		});
	};

	const currentUser = users[currentIndex];
	const currentAvatar = avatarMap[currentUser?.id];
	const currentDescription = userDescriptions[currentUser?.id];
	const hasImageError = imageErrors[currentUser?.id];

	const handleImageError = (userId: number) => {
		setImageErrors((prev) => ({ ...prev, [userId]: true }));
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("id-ID", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	};

	return (
		<div
			className="relative w-full bg-[url('/bg-2.svg')] py-48 bg-blend-overlay bg-cover lg:max-h-[30rem] max-h-[34rem] bg-black/10 bg-gradient-to-br flex items-center justify-center from-gray-50 to-gray-100 rounded-lg overflow-hidden"
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Carousel Content */}
			<div className="w-[90%] h-full rounded-lg ">
				<div className="w-full h-full flex items-center justify-center p-8">
					<div className="text-center max-w-2xl">
						{/* Profile Avatar with Image */}
						<div ref={avatarRef} className="mb-4 pt-10">
							<div className="w-20 h-20 bg-gray-300 rounded-full mx-auto overflow-hidden border-4 border-white shadow-lg">
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
										<svg
											className="w-12 h-12 text-gray-600"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
											/>
										</svg>
									</div>
								)}
							</div>
						</div>

						{/* User Info */}
						<h2 ref={nameRef} className="text-2xl font-bold text-white text-shadow-lg mb-3">
							{currentUser?.username}
						</h2>

						{/* Description/Testimonial Section */}
						<div ref={descriptionRef} className="mb-4 px-4">
							<div className="bg-white shadow-lg bg-opacity-50 rounded-lg p-4">
								<p className="text-gray-700 text-sm italic leading-relaxed">
									&ldquo;{currentDescription}&rdquo;
								</p>
							</div>
						</div>

						{/* Contact Info */}
						<div ref={contactInfoRef} className="flex flex-row items-center justify-center gap-2 flex-wrap">
							<p className="text-white flex items-center justify-center gap-2 text-sm bg-black/25 px-3 py-1 rounded-full">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								{currentUser?.email}
							</p>
							<p className="text-white flex items-center justify-center gap-2 text-sm bg-black/25 px-3 py-1 rounded-full">
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
									/>
								</svg>
								{currentUser?.no_telpon}
							</p>
							<p className="text-white flex items-center justify-center gap-2 text-sm bg-black/25 px-3 py-1 rounded-full">
								Bergabung sejak {formatDate(currentUser?.tanggal_join)}
							</p>
						</div>
					</div>
				</div>

				{/* Dots Indicator */}
				<div ref={dotsRef} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
					{users.map((_, index) => (
						<button
							key={index}
							onClick={() => goToSlide(index)}
							className={`w-3 h-3 rounded-full transition-all duration-300 ${
								index === currentIndex
									? "bg-white scale-125"
									: "bg-gray-400 hover:bg-gray-300"
							}`}
							aria-label={`Go to user ${index + 1}`}
							disabled={isTransitioning}
						/>
					))}
				</div>

				{/* Auto-scroll indicator */}
				<div className="absolute top-4 right-4 flex items-center gap-2 text-white text-xs">
					<div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isPaused ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
					<span>{isPaused ? 'Paused' : 'Auto'}</span>
				</div>
			</div>
		</div>
	);
}
