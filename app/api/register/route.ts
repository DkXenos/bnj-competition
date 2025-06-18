'use client'
import supabase from "@/lib/db";

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
