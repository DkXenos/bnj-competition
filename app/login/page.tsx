"use client";

import { useState } from "react";
import { loginUser } from "@/app/api/login/route";
import Link from "next/link";

export default function LoginPage() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { success, user } = await loginUser(form.usernameOrEmail, form.password);

    if (!success) {
      setLoading(false);
      return;
    }

    // Redirect or perform any action after successful login
    console.log("Logged in user:", user);
    window.location.href = "/";
    setLoading(false);
  };

  return (
   <div>
      <div className="flex flex-col bg-gradient-to-br from-sky-50 to-blue-100 min-h-screen w-screen items-center justify-center">
        <div className="bg-white flex flex-col min-w-[40%] min-h-[20rem] p-8 rounded-xl gap-8 shadow-lg border border-gray-100 justify-between">
          <h1 className="text-center text-2xl text-black">Masuk</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
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
            <Link href="/register" className="text-blue-500 hover:text-blue-600 font-medium">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}