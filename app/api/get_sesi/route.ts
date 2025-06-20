import supabase from "@/lib/db";

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