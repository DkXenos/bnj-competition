import supabase from "@/lib/db";

export async function confirmSession(sesiId: number, link: string) {
  if (!link || !link.trim()) {
    return { success: false, error: "Link meeting tidak boleh kosong." };
  }

  try {
    const { error } = await supabase
      .from("sesi")
      .update({ status: "Terkonfirmasi", link: link })
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
export async function GetAllLaporanWhichIsNotConfirmed(){
  const { data: laporan, error } = await supabase
    .from("sesi")
    .select("*")
    .eq("status_laporan", "Laporan Dikirim");

  if (error) {
    console.error("Error fetching unconfirmed reports:", error);
    throw error;
  }

  return laporan || [];
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

export async function GetAllReviewByMentorID(mentor_id: number) {
  const { data: reviews, error } = await supabase
    .from("sesi")
    .select("*")
    .eq("mentor_id", mentor_id)
    .not("rating_ulasan", "is", null);

  if (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }

  return reviews || [];
}
export async function GetMenteeDetails(sesiId: number) {
  const { data: sesi, error } = await supabase
    .from("sesi")
    .select("*")
    .eq("id", sesiId)     
    .single();
    
  if (error) {
    console.error("Error fetching sesi details:", error);
    throw error;
  }

  const { data: mentee, error: menteeError } = await supabase
    .from("users")
    .select("*")
    .eq("id", sesi.mentee_id)
    .single();
  if (menteeError) {
    console.error("Error fetching mentee details:", menteeError);
    throw menteeError;
  }
    
  return mentee || null;
}

export async function SubmitReview(
  sesiId: number,
  rating: number,
  review: string,
  mentor_id: number
) {
  try {
    const { error } = await supabase
      .from("sesi")
      .update({
        rating_ulasan: rating,
        deskripsi_ulasan: review,
      })
      .eq("id", sesiId);

    if (error) {
      console.error("Error submitting review:", error);
      return { success: false, error: error.message };
    }

    await UpdateTotalRating(mentor_id);
    return { success: true, message: "Review berhasil dikirim." };
  } catch (error) {

    console.error("Unexpected error:", error);
    return { success: false, error: "Terjadi kesalahan saat mengirim review." };
  }
}


export async function UpdateTotalRating(mentor_id: number) {
  // Pastikan mentor_user_id adalah user_id dari mentor, bukan id dari tabel mentors
  const { data, error } = await supabase
    .from("sesi")
    .select("rating_ulasan")
    .eq("mentor_id", mentor_id)
    .not("rating_ulasan", "is", null);

  if (error) {
    console.error("Error fetching ratings:", error);
    return null;
  }

  if (!data || data.length === 0) {
    // Tetap update ke 0 jika tidak ada rating
    const { error: updateError } = await supabase
      .from("mentors")
      .update({ total_rating: 0 })
      .eq("id", mentor_id);
    if (updateError) {
      console.error("Error updating mentor rating to 0:", updateError);
    }
    return 0;
  }

  // Hitung jumlah total rating
  const totalRating = data.reduce((sum, sesi) => sum + (sesi.rating_ulasan ?? 0), 0);

  // Hitung rata-rata
  const averageRating = totalRating / data.length;

  // Bulatkan ke bilangan bulat terdekat
  const roundedRating = Math.round(averageRating);

  // Update total_rating di tabel mentors berdasarkan user_id
  const { error: updateError } = await supabase
    .from("mentors")
    .update({ total_rating: roundedRating })
    .eq("id", mentor_id);

  if (updateError) {
    console.error("Error updating mentor rating:", updateError);
  }

  return roundedRating;
}
export async function TindakLanjutLaporan(id: number, desc: string) {
  try {
    const { error } = await supabase
      .from("sesi")
      .update({
        status_laporan: "Ditindak Lanjuti",
        deskripsi_tindak_lanjut: desc,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating report status:", error);
      return { success: false, error: error.message };
    }

    return { success: true, message: "Laporan berhasil ditindak lanjuti." };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Terjadi kesalahan saat menindak lanjuti laporan." };
  }
}
export async function DemoteMentor(sesi_id:number, mentor_id: number, mentor_user_id:number, alasan_didemote: string) {
  console.log("mentor_id:", mentor_id);
  try {
    await supabase .from("users").update({isMentor: false}).eq("id", mentor_user_id);
    const { error } = await supabase
      .from("mentors")
      .update({ alasan_didemote: alasan_didemote, is_confirmed: false })
      .eq("id", mentor_id);
    
      const { error:aaa } = await supabase
      .from("sesi")
      .update({
        status_laporan: "Ditindak Lanjuti",
        deskripsi_tindak_lanjut: alasan_didemote,
      })
      .eq("id", sesi_id);

    if (aaa) {
      console.error("Error updating report status:", error);
      return { success: false, error: aaa.message };
    }
    if (error) {
      console.error("Error demoting mentor:", error);
      return { success: false, error: error.message };
    }

    return { success: true, message: "Mentor berhasil diturunkan." };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Terjadi kesalahan saat menurunkan mentor." };
  }
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

export function GetMentorData(sesiId: number) {
  return supabase
    .from("sesi")
    .select("*")
    .eq("id", sesiId)
    .single()
    .then(({ data, error }) => {
      if (error) {
        console.error("Error fetching mentor data:", error);
        throw error;
      }
      return data?.mentor_id || null;
    });
}
