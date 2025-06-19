"use client";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import LogoutButton from "./logout-button";

export default function Navbar() {
    const { loggedInUser } = useUser();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const toggleDropdown = () => {
        setDropdownVisible((prev) => !prev);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
                
                <div className="flex items-center space-x-8">
                    <Link href="/" className="text-2xl font-bold text-gray-900">
                        MentorPact
                    </Link>
                    
                    
                    <Link 
                        href="/catalog" 
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Explore
                    </Link>
                </div>

                
                <div className="flex-1 max-w-2xl mx-8">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg 
                                className="h-5 w-5 text-gray-400" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search mentors..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                
                <div className="flex items-center space-x-6">
                    {loggedInUser ? (
                        <>
                            <Link 
                                href="/" 
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Beranda
                            </Link>
                            <Link 
                                href="/register-mentor" 
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Jadi Mentor
                            </Link>
                            <div className="relative">
                                <div 
                                    className="flex items-center space-x-2 cursor-pointer"
                                    onClick={toggleDropdown}
                                >
                                    <span className="text-gray-700">
                                        {loggedInUser.username}
                                    </span>
                                    <svg 
                                        className="w-4 h-4 text-gray-500" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M19 9l-7 7-7-7" 
                                        />
                                    </svg>
                                </div>
                                {dropdownVisible && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                                        <Link href="/user_dashboard" className=""><h1 className="hover:bg-gray-100 w-full text-black text-md p-2 text-center">Dashboard</h1></Link>
                                        <Link href="/all_chats_page" className=""><h1 className="hover:bg-gray-100 w-full text-black text-md p-2 text-center">Chats</h1></Link>
                                        <LogoutButton />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link 
                                href="/about" 
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                About
                            </Link>
                            <Link 
                                href="/mentor-register" 
                                className="text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Jadi Mentor
                            </Link>
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                            >
                                Masuk
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}