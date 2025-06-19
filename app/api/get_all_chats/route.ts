"use client";
import supabase from "@/lib/db";

export async function GetAllChats(loggedInUser: number) {
  if(loggedInUser === undefined || isNaN(loggedInUser)) {
    throw new Error("Invalid user ID");
  }

  const { data, error } = await supabase
    .from("chat_composite_key")
    .select("*")
    .or(`first_user.eq.${loggedInUser},second_user.eq.${loggedInUser}`)

  if (error) {
    console.error("Error fetching chats:", error);
    throw error;
  }

  return data || [];
}
