"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { registerUser } from "@/app/api/register/route";
import Link from "next/link";

export default function RegisterMentorPage() {
  const { loggedInUser } = useUser(); // Access logged-in user from UserContext
  const [form, setForm] = useState({
    username: "",
    email: "",
    no_telpon: "",
    password: "",
    foto_ktp: null,
    foto_kk: null,
  });
  const [loading, setLoading] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    if (!loggedInUser) {
      setShowLoginPopup(true);
    }
  }, [loggedInUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { success, error } = await registerUser(form);
    if (!success) {
      console.error("Registration failed:", error);
      alert("Gagal mendaftar. Silakan coba lagi.");
      setLoading(false);
      return;
    }
    alert("Pendaftaran berhasil! Silakan masuk.");
    window.location.href = "/login"; // Redirect to login page after successful registration

    setLoading(false);
  };

  return (
    <div>
      {/* Login Required Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/70 backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold text-center mb-4 text-black">Akun Diperlukan</h1>
            <p className="text-gray-600 text-center mb-4">
              Anda harus daftar terlebih dahulu untuk mendaftar sebagai mentor.
            </p>
            <div className="flex justify-center w-full">
              <Link
                href="/login"
                className="px-4 py-2 bg-blue-500 text-white w-full text-center rounded hover:bg-blue-600 transition-colors"
              >
                Masuk
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col bg-gradient-to-br from-sky-50 to-blue-100 min-h-screen w-screen items-center justify-center">
        <div className="bg-white flex flex-col min-w-[40%] min-h-[40rem] p-8 rounded-xl gap-8 shadow-lg border border-gray-100">
          <h1 className="text-center text-2xl text-black">Daftar Mentor</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
            <input
              onChange={handleChange}
              required
              type="text"
              name="username"
              value={form.username}
              placeholder="Nama Lengkap"
              className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              onChange={handleChange}
              required
              type="email"
              name="email"
              value={form.email}
              placeholder="Email"
              className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              onChange={handleChange}
              required
              type="password"
              name="password"
              value={form.password}
              placeholder="Password"
              className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              onChange={handleChange}
              required
              type="tel"
              name="no_telpon"
              value={form.no_telpon}
              placeholder="Nomor Telepon"
              className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {/* Upload KTP */}
            <div className="flex flex-col gap-2">
              <label className="block text-gray-700 font-medium">Foto KTP</label>
              <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50">
                <input
                  onChange={handleFileChange}
                  required
                  type="file"
                  name="foto_ktp"
                  accept="image/*"
                  className="hidden"
                  id="upload-ktp"
                />
                <label
                  htmlFor="upload-ktp"
                  className="cursor-pointer flex flex-col items-center justify-center text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <i className="bi bi-file-earmark-fill text-3xl"></i>
                  <span className="mt-2 text-sm">Klik untuk mengunggah foto KTP</span>
                </label>
              </div>
            </div>

            {/* Upload KK */}
            <div className="flex flex-col gap-2">
              <label className="block text-gray-700 font-medium">Foto KK</label>
              <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50">
                <input
                  onChange={handleFileChange}
                  required
                  type="file"
                  name="foto_kk"
                  accept="image/*"
                  className="hidden"
                  id="upload-kk"
                />
                <label
                  htmlFor="upload-kk"
                  className="cursor-pointer flex flex-col items-center justify-center text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <i className="bi bi-file-earmark-fill text-3xl"></i>
                  <span className="mt-2 text-sm">Klik untuk mengunggah foto KK</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors duration-200 font-medium"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>
          <p className="text-center text-black">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
