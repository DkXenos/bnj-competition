import supabase from "@/lib/db";

export async function GetAllMentors() {
    const { data: mentors, error } = await supabase
        .from("mentors")
        .select("*")

    if (error) {
        throw new Error(error.message);
    }
    return mentors || [];
}
