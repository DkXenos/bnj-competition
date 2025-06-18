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
      <div className="flex flex-col bg-white min-h-screen w-screen items-center justify-center">
        <div className="bg-slate-900 flex flex-col min-w-[40%] min-h-[30rem] p-8 rounded-xl gap-8">
          <h1 className="text-center text-2xl">Daftar</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              onChange={handleChange}
              required
              type="text"
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              placeholder="Username"
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
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
              disabled={loading}
            >
              {" "}
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
          <p className="text-center">
            Sudah memiliki akun?{" "}
            <Link href="/register" className="text-blue-500">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}