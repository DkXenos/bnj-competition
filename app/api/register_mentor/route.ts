import supabase from "@/lib/db";

export async function registerMentor({
  userId,
  deskripsi,
  link_video,
  harga_per_sesi,
  foto_ktp,
  foto_kk,
}: {
  userId: number;
  deskripsi: string;
  link_video: string;
  harga_per_sesi: number;
  foto_ktp: File;
  foto_kk: File;
}) {
  if (!userId || !deskripsi || !link_video || !harga_per_sesi || !foto_ktp || !foto_kk) {
    return { success: false, error: "All fields are required." };
  }

  try {
    // Helper function to upload files to Supabase Storage
    const uploadFileToSupabase = async (file: File, path: string) => {
      const { error } = await supabase.storage
        .from("mentor-photos") // Replace with your bucket name
        .upload(path, file);

      if (error) {
        console.error("Error uploading file:", error);
        throw error;
      }

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from("mentor-photos")
        .getPublicUrl(path);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Failed to retrieve public URL for uploaded file.");
      }

      return publicUrlData.publicUrl;
    };

    // Generate unique file paths for the uploaded images
    const fotoKtpPath = `ktp/${Date.now()}-${foto_ktp.name}`;
    const fotoKkPath = `kk/${Date.now()}-${foto_kk.name}`;

    // Upload the files and get their public URLs
    const fotoKtpUrl = await uploadFileToSupabase(foto_ktp, fotoKtpPath);
    const fotoKkUrl = await uploadFileToSupabase(foto_kk, fotoKkPath);

    // Insert mentor data into the mentors table
    const { data: mentorData, error: mentorError } = await supabase
      .from("mentors")
      .insert([
        {
          user_id: userId,
          deskripsi,
          link_video,
          harga_per_sesi,
          tanggal_join_mentor: new Date().toISOString(),
          total_rating: 0, // Default rating
          foto_ktp: fotoKtpUrl,
          foto_kk: fotoKkUrl,
        },
      ])
      .select();

    console.log("Data being inserted:", {
      user_id: userId,
      deskripsi,
      link_video,
      harga_per_sesi,
      tanggal_join_mentor: new Date().toISOString(),
      total_rating: 0,
      foto_ktp: fotoKtpUrl,
      foto_kk: fotoKkUrl,
    });

    if (mentorError) {
      console.error("Error registering mentor:", mentorError);
      return { success: false, error: mentorError.message };
    }

    return { success: true, data: mentorData };
  } catch (error) {
    console.error("Unexpected error during mentor registration:", error);
    return { success: false, error: "Unexpected error occurred." };
  }
}