import supabase from "@/lib/db";
export async function confirmSession(sesiId: number) {
  try {
    const { error } = await supabase
      .from("sesi")
      .update({ status: "Terkonfirmasi" })
      .eq("id", sesiId);

    if (error) {
      console.error("Error confirming session:", error);
      return { success: false, error: error.message };
    }

    return { success: true, message: "Sesi berhasil dikonfirmasi." };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Terjadi kesalahan saat mengonfirmasi sesi." };
  }
}


export async function GetSesi() {
  const { data: sesi, error } = await supabase
    .from("sesi")
    .select("*")
    .order("jam_mulai", { ascending: true });

  if (error) {
    console.error("Error fetching sesi:", error);
    throw error;
  }

  return sesi || [];
}

export async function CheckForFreeTrial(mentor_id : number, user_id : number){
  const { data, error } = await supabase
    .from("sesi")
    .select("isFreeTrial")
    .eq("mentor_id", mentor_id)
    .eq("mentee_id", user_id)
    .single();

  if(data == null){
    return null;
  }

  if (error) {
    console.error("Error checking free trial:", error);
    return false;
  }

  return data?.isFreeTrial || false;
}