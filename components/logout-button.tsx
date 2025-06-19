"use client";
import { useUser } from "@/context/UserContext";

export default function LogoutButton() {
  const { setLoggedInUser } = useUser();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("loggedInUser");
    
    // Update the user context
    setLoggedInUser(null);
    
    // Redirect to home page
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 text-red-500 text-center hover:bg-gray-100 w-full"
    >
      Keluar
    </button>
  );
}