import supabase from "@/lib/db";
import ChatButton from "@/components/chat-mentor-button";
import BookMentorButton from "@/components/book-mentor-button";
import * as sesi from "@/lib/sesi";
import Link from "next/link";
import Image from "next/image";
import { ISesi } from "@/types/sesi.md";
import { IUser } from "@/types/user.md";

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
    <div className="min-h-screen min-w-screen bg-sky-100 pb-16">
      <div className="min-h-[0vh] md:min-h-[8vh] w-screen"></div>
      {/* Responsive container for the main content */}
      <div className="min-w-screen min-h-screen p-4 md:p-8 flex items-center">
        {/* Main Content Card - Made responsive */}
        <div className="bg-white/70 mt-16 rounded-xl w-[95%] md:w-[80%] lg:w-[70%] mx-auto shadow-lg overflow-hidden">
          {/* Mentor Profile Section */}
          <div className="bg-white p-4 sm:p-8 border-b border-sky-100">
            <Link
              href="/"
              className="flex items-center justify-start gap-2 pb-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <i className="bi bi-arrow-return-left"></i>
              <span className="font-medium">Kembali ke beranda</span>
            </Link>
            {/* Responsive flex container */}
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              {/* Profile Avatar */}
              <div
                style={{
                  backgroundImage: `url('${
                    data_lengkap_mentor?.profile_image || "/def-avatar.png"
                  }')`,
                }}
                className="bg-cover bg-center w-24 h-24 md:w-28 md:h-28 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0"
              ></div>

              {/* Mentor Information - Centered on mobile */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                {/* Mentor Name - Responsive font size */}
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                  {data_lengkap_mentor.username
                    .split(" ")
                    .map(
                      (word: string) =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")}
                </h1>

                {/* Mentor Stats - Justify center on mobile */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4 justify-center md:justify-start">
                  <div className="flex items-center gap-1">
                    <i className="bi bi-star-fill text-yellow-500"></i>
                    <span>{mentor.total_rating}/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="bi bi-wallet2"></i>
                    <span>
                      Rp {mentor.harga_per_sesi.toLocaleString()}/Sesi
                    </span>
                  </div>
                </div>

                {/* Quick Description Preview */}
                <p className="text-gray-600 text-sm line-clamp-3 md:line-clamp-2 mb-4">
                  {mentor.deskripsi
                    .split(" ")
                    .map(
                      (word: string) =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    )
                    .join(" ")}
                </p>
              </div>

              {/* Chat Button - Responsive container */}
              <div className="flex-shrink-0 w-full md:w-auto">
                <div className="flex gap-2 w-full justify-center md:justify-start">
                  <ChatButton
                    receiver_id={mentor.user_id}
                    reciever_name={data_lengkap_mentor.username}
                  />
                  <BookMentorButton
                    mentor={{
                      ...mentor,
                      user: data_lengkap_mentor,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Video Section */}
            {mentor.link_video && (
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <i className="bi bi-camera-video-fill"></i>
                  Video Profil
                </h2>
                <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-sky-100">
                  <div
                    className="relative w-full"
                    style={{ paddingTop: "56.25%" }}
                  >
                    <iframe
                      className="absolute top-0 left-0 w-full h-full"
                      src={
                        mentor.link_video.includes("youtu.be")
                          ? `https://www.youtube.com/embed/${
                              mentor.link_video.split("youtu.be/")[1]
                            }`
                          : mentor.link_video.replace("watch?v=", "embed/")
                      }
                      title="Profil Mentor"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Reviews Section - Responsive container */}
      {allReviews && allReviews.length > 0 && (
        <div className="w-[95%] md:w-[80%] lg:w-[70%] max-w-5xl mx-auto mt-8 bg-white/80 rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2">
            <i className="bi bi-chat-left-text-fill text-sky-500"></i>
            <p className="text-black">Ulasan Mentor</p>
          </h2>
          <div className="space-y-4">
            {reviewsWithMentee.map((review, idx) => (
              <div
                key={idx}
                className="border-b border-sky-100 pb-4 mb-4 last:border-b-0 last:mb-0"
              >
                <div className="flex items-start gap-3">
                  <Image
                    src={review.mentee.profile_image || "/guest-photo.svg"}
                    alt={review.mentee.username || "Mentee"}
                    width={32}
                    height={32}
                    className="rounded-full object-cover mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-black">
                        {review.mentee.username || "Pengguna"}
                      </span>
                      <span className="text-yellow-500 flex items-center gap-1">
                        <i className="bi bi-star-fill"></i>
                        {review.rating_ulasan}/5
                      </span>
                    </div>
                    <p className="text-black italic">
                      &quot;{review.deskripsi_ulasan || "Sangat bagus"}&quot;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
