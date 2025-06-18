"use client";

import { useState } from "react";
import { registerUser } from "@/app/api/register/route";
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
      <div className="flex flex-col bg-white min-h-screen w-screen items-center justify-center">
        <div className="bg-slate-900 flex flex-col min-w-[40%] min-h-[30rem] p-8 rounded-xl gap-8">
          <h1 className="text-center text-2xl">Daftar</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              onChange={handleChange}
              required
              type="text"
              name="username"
              value={form.username}
              placeholder="Username"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              onChange={handleChange}
              required
              type="email"
              name="email"
              value={form.email}
              placeholder="Email"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              onChange={handleChange}
              required
              type="password"
              name="password"
              value={form.password}
              placeholder="Password"
              className="p-2 border border-gray-300 rounded"
            />
            <input
              onChange={handleChange}
              required
              name="no_telpon"
              value={form.no_telpon}
              placeholder="nomor telepon anda"
              className="p-2 border border-gray-300 rounded"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
              disabled={loading}
            >
              {" "}
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>
          <p className="text-center">
            Sudah memiliki akun?{" "}
            <Link href="/login" className="text-blue-500">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
