import supabase from "@/lib/db";

export async function UpdateUserProfile({
  userId,
  username,
  email,
  no_telpon,
  password,
  profile_image,
}: {
  userId: number;
  username: string;
  email: string;
  no_telpon: string;
  password: string;
  profile_image?: string; // Optional for profile image
}) {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        username,
        email,
        no_telpon,
        password,
        profile_image,
      })
      .eq("id", userId);

    if (error) {
      console.error("Error updating user profile:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error during profile update:", error);
    return { success: false, error: "Unexpected error occurred." };
  }
}