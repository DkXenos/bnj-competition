"use client";

import { useState } from "react";
import { registerUser } from "@/lib/login-register";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    no_telpon: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      <div className="flex flex-col bg-gradient-to-br from-sky-50 to-blue-100 min-h-screen w-screen items-center justify-center">
        <div className="bg-white flex flex-col min-w-[40%] min-h-[30rem] p-8 rounded-xl gap-8 shadow-lg border border-gray-100">
          <h1 className="text-center text-2xl text-black">Daftar</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
            <input
              onChange={handleChange}
              required
              type="text"
              name="username"
              value={form.username}
              placeholder="Username"
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
