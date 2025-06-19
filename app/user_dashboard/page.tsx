"use client";
import JadwalCard from "@/components/jadwal-card";
import { useUser } from "@/context/UserContext";
import Link from "next/link";


export default function UserDashboard() {
  const { loggedInUser } = useUser();
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100">
      <div className="relative z-10 flex flex-col items-center justify-start mt-14 h-[15rem] w-screen bg-sky-100">
        <div className="border-1 absolute -bottom-30 z-10 flex flex-col items-start p-4 justify-start mt-14 h-[15rem] w-[50%] rounded-lg shadow-lg bg-white">
             <div className="relative w-full h-full">
                <div className="absolute -left-20 w-50 h-50 bg-black border-white shadow-lg border-3 rounded-full"></div>
                <div className="w-full h-full flex flex-col items-center justify-start p-4">
                    <div className="w-30 h-50 rounded-full"></div>
                    <h1 className="text-2xl text-left font-bold mb-4 text-black">
                        Halo, {loggedInUser?.username}! - Mentor
                    </h1>
                    <p className="text-gray-700 mb-2">
                        Selamat datang di dashboard pengguna Anda!
                    </p>
                    <p className="text-gray-700 mb-2">
                        email: {loggedInUser?.email}
                    </p>
                    <p className="text-gray-700 mb-2">
                        nomor telepon: {loggedInUser?.no_telpon || "Tidak ada nomor telepon yang terdaftar"}
                    </p>
                    <Link href={'/'} className="text-blue-400 mt-4">Edit Profile</Link>
                </div>
            </div>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center justify-start mt-14 h-[8rem] w-screen"></div>
      <div className="flex flex-col w-[70%] bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">
          Jadwalku
        </h1>
        {loggedInUser && <JadwalCard loggedInUser={loggedInUser} />}
      </div>
    </div>
  );
}
