"use client";

import { useState } from "react";
import { loginUser } from "@/lib/login-register";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null); 

    const { success, user, error: loginError } = await loginUser(
      form.usernameOrEmail,
      form.password
    );

    setLoading(false);

    if (!success) {
      setError(loginError || "Terjadi kesalahan. Silakan coba lagi.");
      return;
    }

    // Redirect or perform any action after successful login
    console.log("Logged in user:", user);
    window.location.href = "/";
  };

  return (
    <div>
      <div className="flex flex-col bg-gradient-to-br from-sky-50 to-blue-100 min-h-screen w-screen items-center justify-center">
        <div className="bg-white flex flex-col min-w-[40%] min-h-[20rem] p-8 rounded-xl gap-8 shadow-lg border border-gray-100 justify-between">
          <h1 className="text-center text-2xl text-black">Masuk</h1>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 text-black"
          >
            <input
              onChange={handleChange}
              required
              type="text"
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              placeholder="Username atau Email"
              className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              onChange={handleChange}
              required
              type="password"
              name="password"
              value={form.password}
              placeholder="Password"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors duration-200 font-medium"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
          <p className="text-center text-black">
            Belum memiliki akun?{" "}
            <Link
              href="/register"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Daftar
            </Link>
          </p>
        </div>
      </div>

      {/* Error Popup */}
      {error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Login Gagal
            </h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}