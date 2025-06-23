"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { registerMentor } from "@/lib/login-register";
import supabase from "@/lib/db";
import Link from "next/link";
import Image from "next/image";

export default function RegisterMentorPage() {
  const { loggedInUser } = useUser(); // Access logged-in user from UserContext
  const [form, setForm] = useState({
    deskripsi: "",
    link_video: "",
    harga_per_sesi: "",
    foto_ktp: null as File | null,
    foto_kk: null as File | null,
  });
  const [preview, setPreview] = useState({
    foto_ktp: "",
    foto_kk: "",
  }); // State untuk pratinjau gambar
  const [loading, setLoading] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedExtensions = ["jpg", "jpeg", "png", "svg"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        alert("Tipe file tidak diizinkan. Harap unggah file .jpg, .jpeg, .png, atau .svg.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran file melebihi batas 5MB.");
        return;
      }

      setForm((prev) => ({ ...prev, [name]: file }));
      setPreview((prev) => ({ ...prev, [name]: URL.createObjectURL(file) })); // Generate preview URL
    }
  };

  useEffect(() => {
    // Check if the user is logged in
    if (!loggedInUser) {
      setShowLoginPopup(true);
    }
  }, [loggedInUser]);

  const uploadFileToSupabase = async (file: File, path: string) => {
    const { error } = await supabase.storage
      .from("mentor-photos") // Replace with your bucket name
      .upload(path, file);

    if (error) {
      console.error("Error uploading file:", {
        message: error.message || "No error message",
      });
      throw error;
    }

    const { data: publicUrlData } = supabase.storage
      .from("mentor-photos")
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
      // Define a consistent result type
      type MentorResult = {
        success: boolean;
        error?: string;
        isUpdate: boolean;
      };

      // Check if user already has a mentor record
      const { data: existingMentor, error: checkError } = await supabase
        .from("mentors")
        .select("id")
        .eq("user_id", Number(loggedInUser?.id))
        .single();
      
      if (checkError && checkError.code !== "PGRST116") { // Not found error is expected
        console.error("Error checking existing mentor record:", checkError);
        alert("Terjadi kesalahan saat memeriksa data mentor.");
        setLoading(false);
        return;
      }

      // Upload files to Supabase
      const fotoKtpPath = `ktp/${Date.now()}-${form.foto_ktp?.name}`;
      const fotoKkPath = `kk/${Date.now()}-${form.foto_kk?.name}`;
      const fotoKtpUrl = await uploadFileToSupabase(form.foto_ktp!, fotoKtpPath);
      const fotoKkUrl = await uploadFileToSupabase(form.foto_kk!, fotoKkPath);

      let result: MentorResult;
      
      if (existingMentor) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("mentors")
          .update({
            deskripsi: form.deskripsi,
            link_video: form.link_video,
            harga_per_sesi: parseInt(form.harga_per_sesi, 10),
            foto_ktp: fotoKtpUrl,
            foto_kk: fotoKkUrl,
            is_confirmed: false, // Reset confirmation status when updating
            alasan_ditolak: null // Clear any previous rejection reason
          })
          .eq("user_id", Number(loggedInUser?.id))
          .select();
        
        result = {
          success: !updateError,
          error: updateError?.message,
          isUpdate: true
        };
      } else {
        // Insert new record
        const registerResult = await registerMentor({
          userId: Number(loggedInUser?.id),
          deskripsi: form.deskripsi,
          link_video: form.link_video,
          harga_per_sesi: parseInt(form.harga_per_sesi, 10),
          foto_ktp: fotoKtpUrl,
          foto_kk: fotoKkUrl,
        });
        result = {
          success: registerResult.success,
          error: registerResult.error,
          isUpdate: false
        };
      }

      if (!result.success) {
        console.error(result.isUpdate ? "Mentor update failed:" : "Mentor registration failed:", result.error);
        alert(result.isUpdate ? 
          "Gagal memperbarui data mentor. Silakan coba lagi." : 
          "Gagal mendaftar sebagai mentor. Silakan coba lagi.");
        setLoading(false);
        return;
      }

      alert(result.isUpdate ? 
        "Data mentor berhasil diperbarui!" : 
        "Pendaftaran mentor berhasil!");
      window.location.href = "/user_dashboard"; // Redirect to user dashboard after successful operation
    } catch (error) {
      console.error("Error during mentor registration/update:", error);
      alert("Terjadi kesalahan saat mengelola data mentor. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Login Required Popup */}
      {showLoginPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-300/70 backdrop-blur-lg">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold text-center mb-4 text-black">Akun Diperlukan</h1>
            <p className="text-gray-600 text-center mb-4">
              Anda harus login terlebih dahulu untuk mendaftar sebagai mentor.
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

      <div className="flex flex-col bg-gradient-to-br from-sky-50 to-blue-100 min-h-screen w-screen items-center justify-center mt-15">
        <div className="bg-white flex flex-col min-w-[40%] min-h-[40rem] p-8 rounded-xl gap-8 shadow-lg border border-gray-100">
          <h1 className="text-center text-2xl text-black ">Daftar Mentor</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black">
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
              {/* Preview Foto KTP */}
              {preview.foto_ktp && (
                <div className="mt-4 w-full h-40 overflow-hidden rounded-lg border border-gray-300">
                  <Image
                    width={128}
                    height={128}
                    loading="lazy"
                    src={preview.foto_ktp}
                    alt="Preview Foto KTP"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
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
              {/* Preview Foto KK */}
              {preview.foto_kk && (
                <div className="mt-4 w-full h-40 overflow-hidden rounded-lg border border-gray-300">
                  <Image
                    width={128}
                    height={128}
                    loading="lazy"
                    src={preview.foto_kk}
                    alt="Preview Foto KK"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Additional Mentor Information */}
            <div className="flex flex-col gap-2">
              <label className="block text-gray-700 font-medium">Deskripsi</label>
              <textarea
                onChange={handleChange}
                name="deskripsi"
                value={form.deskripsi}
                placeholder="Deskripsi Singkat tentang Anda"
                className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-gray-700 font-medium">Link Video Perkenalan (YouTube)</label>
              <input
                onChange={handleChange}
                type="url"
                name="link_video"
                value={form.link_video}
                placeholder="https://www.youtube.com/..."
                className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-gray-700 font-medium">Harga Per Sesi</label>
              <input
                onChange={handleChange}
                type="number"
                name="harga_per_sesi"
                value={form.harga_per_sesi}
                placeholder="Harga dalam Rupiah"
                className="p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg transition-colors duration-200 font-medium"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Daftar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
