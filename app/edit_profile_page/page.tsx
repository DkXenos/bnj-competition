"use client";

import { useState, useEffect } from "react";
import { UpdateUserProfile } from "@/app/api/update_user_profile/route";
import supabase from "@/lib/db";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import Image from "next/image";

export default function EditProfilePage() {
  const { loggedInUser } = useUser(); // Access logged-in user from UserContext
  const [form, setForm] = useState({
    username: "",
    email: "",
    no_telpon: "",
    password: "",
    profile_image: null as File | null,
  });
  const [preview, setPreview] = useState<string | null>(null); // For image preview
  const [loading, setLoading] = useState(false);

  // Populate form with loggedInUser data when the component mounts
  useEffect(() => {
    if (loggedInUser) {
      setForm((prev) => ({
        ...prev,
        username: loggedInUser.username || "",
        email: loggedInUser.email || "",
        no_telpon: loggedInUser.no_telpon || "",
      }));
    }
  }, [loggedInUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setForm((prev) => ({ ...prev, profile_image: file }));
      setPreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const uploadFileToSupabase = async (file: File, path: string) => {
    const { error } = await supabase.storage
      .from("profile-images") // Replace with your bucket name
      .upload(path, file);

    if (error) {
      console.error("Error uploading file:", {
        message: error.message || "No error message",
      });
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from("profile-images")
      .getPublicUrl(path);

    if (!publicUrlData?.publicUrl) {
      throw new Error("Failed to retrieve public URL for uploaded file.");
    }

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let profileImageUrl = null;

      // Upload profile image if a new file is selected
      if (form.profile_image) {
        const filePath = `profile-images/${Date.now()}-${form.profile_image.name}`;
        profileImageUrl = await uploadFileToSupabase(form.profile_image, filePath);
      }

      const { success, error } = await UpdateUserProfile({
        userId: loggedInUser?.id || 0, // Use the logged-in user's ID
        username: form.username,
        email: form.email,
        no_telpon: form.no_telpon,
        password: form.password,
        profile_image: profileImageUrl || undefined, // Only update if a new image is uploaded
      });

      if (!success) {
        console.error("Profile update failed:", error);
        alert("Gagal memperbarui profil. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      alert("Profil berhasil diperbarui!");
      window.location.href = "/user_dashboard"; // Redirect to user dashboard after successful update
    } catch (error) {
      console.error("Error during profile update:", error);
      alert("Terjadi kesalahan saat memperbarui profil. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col bg-gradient-to-br from-sky-50 to-blue-100 min-h-screen w-screen items-center justify-center">
        <div className="bg-white flex flex-col min-w-[40%] min-h-[30rem] p-8 rounded-xl gap-8 shadow-lg border border-gray-100">
          <h1 className="text-center text-2xl text-black">Edit Profil</h1>
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
            <div className="flex flex-col gap-2">
              <label className="block text-gray-700 font-medium">Foto Profil</label>
              <input
                onChange={handleFileChange}
                type="file"
                accept="image/*"
                className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {preview && (
                <Image
                  width={128}
                  height={128}
                  loading="lazy"
                  id="profile-image-preview"
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full border border-gray-300 mt-4"
                />
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors duration-200 font-medium"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Simpan Perubahan"}
            </button>
          </form>
          <p className="text-center text-black">
            Kembali ke{" "}
            <Link href="/user_dashboard" className="text-blue-500 hover:text-blue-600 font-medium">
              Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
