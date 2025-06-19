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

  if( compositeKeyData == null) {
    console.warn("No chat found for the given users:", first_user, second_user);
    await supabase 
    .from("chat_composite_key")
    .insert({
          first_user: first_user,
          second_user: second_user,
        })
    .single();

    // Fetch the newly created composite key
    const { data: id } = await
    supabase
      .from("chat_composite_key")
      .select("id")
      .eq("first_user", first_user)
      .eq("second_user", second_user)
      .single();
    return id;
  } else {
    return compositeKeyData.id;
  }
}
