"use client";
import supabase from "@/lib/db";

export async function getUserDetailsById(userId: number) {
  if (!userId || isNaN(userId)) {
    throw new Error("Invalid user ID");
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user details:", error);
    return null;
  }

  // Return the user data as is; ensure in your React component you access specific fields, not the whole object directly.
  return data || null;
}