'use client'
import supabase from "@/lib/db";
export async function AddChat(
  composite_chat_id: number,
  text: string,
  receiver_id: number
) {
  if (!composite_chat_id) {
    throw new Error("Chat ID is not valid");
  }

  const { error } = await supabase.from("chats").insert({
    chat_composite_id: composite_chat_id,
    text: text,
    receiver_id: receiver_id,
    waktu: new Date().toISOString(),
  });

  if (error) {
    console.error("Error adding chat:", error);
    throw error;
  }

  return { success: true };
};


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

export async function GetChat(chat_id: number) {
  if (!chat_id) {
    return null;
  }
  // Fetch the composite key data
  const { data: compositeKeyData, error: compositeKeyError } = await supabase
    .from("chat_composite_key")
    .select("*")
    .eq("id", chat_id)
    .single();

  if (compositeKeyError) {
    console.error("Error fetching chat_composite_key:", compositeKeyError);
    throw compositeKeyError;
  }

  // Fetch the chat data
  const { data: chatData, error: chatError } = await supabase
    .from("chats")
    .select("*")
    .eq("chat_composite_id", chat_id)
    .order("waktu", { ascending: true });

  if (chatError) {
    console.error("Error fetching chat:", chatError);
    throw chatError;
  }

  // Combine the composite key data into the chat result
  const chat = {
    compositeKey: compositeKeyData,
    messages: chatData,
  };

  return { chat };
}


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
