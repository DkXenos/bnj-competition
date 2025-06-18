"use client";
import supabase from "@/lib/db";
import { useUser } from "@/context/UserContext";

export async function AddChat(other_user_id: number, text: string) {
  const { loggedInUser } = useUser();
  if (!loggedInUser) {
    throw new Error("User not logged in");
  }
  if (!other_user_id) {
    throw new Error("Mentor user ID is required");
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", loggedInUser?.id)
    .single();

  const { data: other_user } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", other_user_id)
    .single();

    const { } = await supabase
    .from("chats")
    .insert({
      user_id: loggedInUser.id,
      mentor_id: other_user_id,
      text: text,
      waktu: new Date().toISOString(),
    })

    window.location.reload()
  return { user, other_user };
}
