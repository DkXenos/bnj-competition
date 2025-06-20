"use client";
import supabase from "@/lib/db";

export async function GetChatByFK(first_user: number, second_user: number) {
  if (!first_user || !second_user) {
    return null;
  }

  // Fetch the composite key data
  const { data: compositeKeyData } = await supabase
    .from("chat_composite_key")
    .select("*")
    .eq("first_user", first_user)
    .eq("second_user", second_user)
    .single();

  if (!compositeKeyData) {
    console.warn("No chat found for the given users:", first_user, second_user);

    // Insert a new composite key
    const { data: newCompositeKey, error: insertError } = await supabase
      .from("chat_composite_key")
      .insert({
        first_user: first_user,
        second_user: second_user,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Error creating new chat composite key:", insertError);
      throw insertError;
    }

    return newCompositeKey?.id; // Return the new composite key ID
  }

  return compositeKeyData.id; // Return the existing composite key ID
}
