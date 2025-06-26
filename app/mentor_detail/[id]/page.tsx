import supabase from "@/lib/db";
import * as sesi from "@/lib/sesi";
import { ISesi } from "@/types/sesi.md";
import { IUser } from "@/types/user.md";
import MentorDetailClient from "@/components/MentorDetailClient";

export default async function MentorDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  // Await the params object
  const { id } = await params;

  // Fetch specific permintaan data by id
  const { data: mentor } = await supabase
    .from("mentors")
    .select(`*`)
    .eq("id", id)
    .single();

  const { data: data_lengkap_mentor } = await supabase
    .from("users")
    .select(`*`)
    .eq("id", mentor.user_id)
    .single();

  const allReviews: ISesi[] = await sesi.GetAllReviewByMentorID(id);

  // Fetch mentee details for all reviews efficiently
  let reviewsWithMentee: (ISesi & { mentee: Partial<IUser> })[] = [];
  if (allReviews && allReviews.length > 0) {
    const menteeIds = [
      ...new Set(allReviews.map((review) => review.mentee_id)),
    ];
    const { data: mentees } = await supabase
      .from("users")
      .select("id, username, profile_image")
      .in("id", menteeIds);

    const menteesMap = new Map(mentees?.map((m) => [m.id, m]));

    reviewsWithMentee = allReviews.map((review) => ({
      ...review,
      mentee: menteesMap.get(review.mentee_id) || { username: "Pengguna" },
    }));
  }

  return (
    <MentorDetailClient
      mentor={mentor}
      data_lengkap_mentor={data_lengkap_mentor}
      reviewsWithMentee={reviewsWithMentee}
    />
  );
}
