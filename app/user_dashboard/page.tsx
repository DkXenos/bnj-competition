"use client";
import JadwalCard from "@/components/jadwal-card";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { useState } from "react";

const scheduleData = [
	{
		day: "SENIN",
		title: "Web Development",
		date: "1 Januari 2025",
		location: "Zoom Meeting",
		sessions: ["Session 1 (09:00 - 11:00)", "Session 2 (14:00 - 16:00)"],
		mentor: "Nicho",
		status: "confirmed",
	},
	{
		day: "SELASA",
		title: "Visual Programming",
		date: "2 Januari 2025",
		location: "Google Meet",
		sessions: ["Session 1 (09:00 - 11:00)", "Session 2 (14:00 - 16:00)"],
		mentor: "Nicho",
		status: "pending",
	},
	{
		day: "RABU",
		title: "Pancasila",
		date: "3 Januari 2025",
		location: "Google Meet",
		sessions: ["Session 1 (09:00 - 11:00)"],
		mentor: "Nicho",
		status: "confirmed",
	},
];

const personalScheduleData = [
	{
		day: "KAMIS",
		title: "Alpro",
		date: "4 Januari 2025",
		location: "Zoom Meeting",
		sessions: ["Session 1 (14:00 - 16:00)", "Session 2 (16:00 - 18:00)"],
		mentor: "Nicho",
		status: "confirmed",
	},
	{
		day: "JUMAT",
		title: "Intro to ICT",
		date: "5 Januari 2025",
		location: "Google Meet",
		sessions: ["Session 1 (14:00 - 16:00)"],
		mentor: "Claire ",
		status: "pending",
	},
	{
		day: "MINGGU",
		title: "Linear Algebra",
		date: "7 Januari 2025",
		location: "Google Meet",
		sessions: ["Session 1 (14:00 - 16:00)", "Session 2 (16:00 - 18:00)"],
		mentor: "John Cena",
		status: "confirmed",
	},
];

export default function UserDashboard() {
	const { loggedInUser } = useUser();
	const [currentSchedule, setCurrentSchedule] = useState(0);
	const [isScheduleDetailsOpen, setIsScheduleDetailsOpen] = useState(false);

	// New state for personal schedule
	const [currentPersonalSchedule, setCurrentPersonalSchedule] = useState(0);
	const [isPersonalScheduleDetailsOpen, setIsPersonalScheduleDetailsOpen] = useState(false);

	const nextSchedule = () => {
		setCurrentSchedule((prev) => (prev + 1) % scheduleData.length);
	};

	const prevSchedule = () => {
		setCurrentSchedule((prev) => (prev - 1 + scheduleData.length) % scheduleData.length);
	};

	const openScheduleDetails = () => {
		setIsScheduleDetailsOpen(true);
	};

	const closeScheduleDetails = () => {
		setIsScheduleDetailsOpen(false);
	};

	const nextPersonalSchedule = () => {
		setCurrentPersonalSchedule((prev) => (prev + 1) % personalScheduleData.length);
	};

	const prevPersonalSchedule = () => {
		setCurrentPersonalSchedule((prev) => (prev - 1 + personalScheduleData.length) % personalScheduleData.length);
	};

	const openPersonalScheduleDetails = () => {
		setIsPersonalScheduleDetailsOpen(true);
	};

	const closePersonalScheduleDetails = () => {
		setIsPersonalScheduleDetailsOpen(false);
	};

	const schedule = scheduleData[currentSchedule];
	const personalSchedule = personalScheduleData[currentPersonalSchedule];

	return (
		<div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
			
      {/* warning backend */}
			<div onClick={(e) => {(e.target as HTMLElement).style.display = "none";}}
          className="absolute text-center w-[300px] h-[300px] bg-red-600 z-15 top-[200px] left-[500px] flex items-center justify-center rotate-35 right-0 p-4">
				<h1 className="-rotate-45">masih belum connect sama backend ya jadwal nya</h1>
				<p>(click kotak merah e biar ngilang)</p>
			</div>

			<div className="relative z-10 flex flex-col items-center justify-start mt-14 h-[15rem] w-screen bg-sky-100">
				<div className="border-1 absolute -bottom-30 z-10 flex flex-col items-start p-4 justify-start mt-14 h-[15rem] w-[50%] rounded-lg shadow-lg bg-white">
					<div className="relative w-full h-full">
						<div className="absolute -left-20 w-50 h-50 bg-black border-white shadow-lg border-3 rounded-full"></div>
						<div className="w-full h-full flex flex-col items-center justify-start p-4">
							<div className="w-30 h-50 rounded-full"></div>
							<h1 className="text-2xl text-left font-bold mb-4 text-black">
								Halo, {loggedInUser?.username}! - Mentor
							</h1>
							<p className="text-gray-700 mb-2">Selamat datang di dashboard pengguna Anda!</p>
							<p className="text-gray-700 mb-2">email: {loggedInUser?.email}</p>
							<p className="text-gray-700 mb-2">
								nomor telepon: {loggedInUser?.no_telpon || "Tidak ada nomor telepon yang terdaftar"}
							</p>
							<Link href={"/"} className="text-blue-400 mt-4">
								Edit Profile
							</Link>
						</div>
					</div>
				</div>
			</div>
			<div className="relative z-10 flex flex-col items-center justify-start mt-14 h-[8rem] w-screen"></div>

			{/* Schedule Section */}
			<div className="flex flex-col w-[70%] bg-white rounded-lg shadow-lg p-4 mb-6">
				<h1 className="text-2xl font-bold mb-4 text-black text-center">Jadwal Mentoring</h1>

				<div className="relative bg-sky-100 rounded-lg p-6">
					{/* Day indicator */}
					<div className="flex justify-center mb-4">
						<span className="bg-white px-4 py-2 rounded-full text-black font-bold text-lg shadow-sm">
							{schedule.day}
						</span>
					</div>

					{/* Schedule Content */}
					<div className="text-center">
						<h3 className="text-xl font-bold text-black mb-2">{schedule.title}</h3>
						<p className="text-gray-700 text-lg mb-1">{schedule.date}</p>
						<p className="text-gray-600 mb-4">{schedule.location}</p>

						{/* Sessions */}
						<div className="space-y-2 mb-4">
							{schedule.sessions.map((session, index) => (
								<div key={index} className="bg-white bg-opacity-70 rounded-lg p-3 text-gray-700">
									{session}
								</div>
							))}
						</div>

						{/* Mentor and Status */}
						<div className="flex justify-center items-center gap-4 text-sm mb-4">
							<span className="text-gray-700">Mentor: {schedule.mentor}</span>
							<span
								className={`px-3 py-1 rounded-full text-xs font-medium ${
									schedule.status === "confirmed"
										? "bg-green-100 text-green-800"
										: "bg-yellow-100 text-yellow-800"
								}`}
							>
								{schedule.status === "confirmed" ? "Terkonfirmasi" : "Menunggu"}
							</span>
						</div>

						{/* Details Button */}
						<button
							onClick={openScheduleDetails}
							className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
						>
							Lihat Detail
						</button>
					</div>

					{/* Navigation Arrows */}
					<button
						onClick={prevSchedule}
						className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors z-10"
						aria-label="Previous schedule"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>

					<button
						onClick={nextSchedule}
						className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors z-10"
						aria-label="Next schedule"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>
			</div>

			{/* Personal Schedule Section (Jadwalku) */}
			<div className="flex flex-col w-[70%] bg-white rounded-lg shadow-lg p-4 mb-6">
				<h1 className="text-2xl font-bold mb-4 text-black text-center">Jadwalku</h1>

				<div className="relative bg-sky-100 rounded-lg p-6">
					{/* Day indicator */}
					<div className="flex justify-center mb-4">
						<span className="bg-white px-4 py-2 rounded-full text-black font-bold text-lg shadow-sm">
							{personalSchedule.day}
						</span>
					</div>

					{/* Schedule Content */}
					<div className="text-center">
						<h3 className="text-xl font-bold text-black mb-2">{personalSchedule.title}</h3>
						<p className="text-gray-700 text-lg mb-1">{personalSchedule.date}</p>
						<p className="text-gray-600 mb-4">{personalSchedule.location}</p>

						{/* Sessions */}
						<div className="space-y-2 mb-4">
							{personalSchedule.sessions.map((session, index) => (
								<div key={index} className="bg-white bg-opacity-70 rounded-lg p-3 text-gray-700">
									{session}
								</div>
							))}
						</div>

						{/* Mentor and Status */}
						<div className="flex justify-center items-center gap-4 text-sm mb-4">
							<span className="text-gray-700">Mentor: {personalSchedule.mentor}</span>
							<span
								className={`px-3 py-1 rounded-full text-xs font-medium ${
									personalSchedule.status === "confirmed"
										? "bg-green-100 text-green-800"
										: "bg-yellow-100 text-yellow-800"
								}`}
							>
								{personalSchedule.status === "confirmed" ? "Terkonfirmasi" : "Menunggu"}
							</span>
						</div>

						{/* Details Button */}
						<button
							onClick={openPersonalScheduleDetails}
							className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
						>
							Lihat Detail
						</button>
					</div>

					{/* Navigation Arrows */}
					<button
						onClick={prevPersonalSchedule}
						className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors z-10"
						aria-label="Previous personal schedule"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
					</button>

					<button
						onClick={nextPersonalSchedule}
						className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white shadow-lg w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors z-10"
						aria-label="Next personal schedule"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
						</svg>
					</button>
				</div>

				{/* Original JadwalCard component (if you still want to keep it) */}
				<div className="mt-6 pt-4 border-t border-gray-200">
					<h2 className="text-lg font-semibold text-black mb-4">Jadwal Lainnya</h2>
					{loggedInUser && <JadwalCard loggedInUser={loggedInUser} />}
				</div>
			</div>

			{/* Schedule Details Modal */}
			{isScheduleDetailsOpen && (
				<div className="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto relative">
						<button
							onClick={closeScheduleDetails}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
							aria-label="Close"
						>
							×
						</button>

						<div className="p-6">
							<h3 className="text-xl font-bold text-black mb-4 text-center">Detail Jadwal</h3>

							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">Judul:</span>
									<span className="text-black">{schedule.title}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">Tanggal:</span>
									<span className="text-black">{schedule.date}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">Lokasi:</span>
									<span className="text-black">{schedule.location}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">Mentor:</span>
									<span className="text-black">{schedule.mentor}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">Status:</span>
									<span
										className={`px-2 py-1 rounded text-xs font-medium ${
											schedule.status === "confirmed"
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{schedule.status === "confirmed" ? "Terkonfirmasi" : "Menunggu"}
									</span>
								</div>
							</div>

							<div className="mt-6 pt-4 border-t border-gray-200">
								<h4 className="font-medium text-gray-600 mb-2">Sesi:</h4>
								<div className="space-y-1">
									{schedule.sessions.map((session, index) => (
										<div key={index} className="text-black text-sm">
											• {session}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Personal Schedule Details Modal */}
			{isPersonalScheduleDetailsOpen && (
				<div className="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-auto relative">
						<button
							onClick={closePersonalScheduleDetails}
							className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
							aria-label="Close"
						>
							×
						</button>

						<div className="p-6">
							<h3 className="text-xl font-bold text-black mb-4 text-center">Detail Jadwal Saya</h3>

							<div className="space-y-3">
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">Judul:</span>
									<span className="text-black">{personalSchedule.title}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">Tanggal:</span>
									<span className="text-black">{personalSchedule.date}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">Lokasi:</span>
									<span className="text-black">{personalSchedule.location}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">Mentor:</span>
									<span className="text-black">{personalSchedule.mentor}</span>
								</div>
								<div className="flex justify-between">
									<span className="font-medium text-gray-600">Status:</span>
									<span
										className={`px-2 py-1 rounded text-xs font-medium ${
											personalSchedule.status === "confirmed"
												? "bg-green-100 text-green-800"
												: "bg-yellow-100 text-yellow-800"
										}`}
									>
										{personalSchedule.status === "confirmed" ? "Terkonfirmasi" : "Menunggu"}
									</span>
								</div>
							</div>

							<div className="mt-6 pt-4 border-t border-gray-200">
								<h4 className="font-medium text-gray-600 mb-2">Sesi:</h4>
								<div className="space-y-1">
									{personalSchedule.sessions.map((session, index) => (
										<div key={index} className="text-black text-sm">
											• {session}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
