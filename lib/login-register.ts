"use client";
import supabase from "@/lib/db";

export async function loginUser(usernameOrEmail: string, password: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .or(`email.eq.${usernameOrEmail},username.eq.${usernameOrEmail}`)
    .single();

  if (error || !user) {
    return {
      success: false,
      user: null,
      error: "Pengguna dengan username atau email tersebut tidak ditemukan.",
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      user: null,
      error: "Password yang Anda masukkan salah.",
    };
  }

  // Save the logged-in user to local storage
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  return { success: true, user, error: null };
}

export async function registerUser(form: { username: string; email: string; no_telpon: string; password: string; }) {
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0]; // "HH:MM:SS"
    const { data, error } = await supabase
        .from("users")
        .insert([
            {
                username: form.username,
                password: form.password,
                email: form.email,
                no_telpon: form.no_telpon,
                saldo: 0,
                tanggal_join: timeString, // Use "HH:MM:SS" for timetz
            },
        ])
        .select();

    if (error) {
        console.error("Error registering user:", error.message || "No error message", error.details || "No details", error.hint || "No hint");
        return { success: false, error };
    }

    return { success: true, data };
}


export async function registerMentor({
  userId,
  deskripsi,
  link_video,
  harga_per_sesi,
  foto_ktp,
  foto_kk,
}: {
  userId: number;
  deskripsi: string;
  link_video: string;
  harga_per_sesi: number;
  foto_ktp: string; // Change from File to string
  foto_kk: string; // Change from File to string
}) {
  if (!userId || !deskripsi || !link_video || !harga_per_sesi || !foto_ktp || !foto_kk) {
    return { success: false, error: "All fields are required." };
  }

  try {
    // Insert mentor data into the mentors table
    const { data: mentorData, error: mentorError } = await supabase
      .from("mentors")
      .insert([
        {
          user_id: userId,
          deskripsi,
          link_video,
          harga_per_sesi,
          tanggal_join_mentor: new Date().toISOString(),
          total_rating: 0, // Default rating
          foto_ktp: foto_ktp, // Use the URL
          foto_kk: foto_kk, // Use the URL
        },
      ])
      .select();

    if (mentorError) {
      console.error("Error registering mentor:", mentorError);
      return { success: false, error: mentorError.message };
    }

    return { success: true, data: mentorData };
  } catch (error) {
    console.error("Unexpected error during mentor registration:", error);
    return { success: false, error: "Unexpected error occurred." };
  }
}