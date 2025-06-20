import supabase from "@/lib/db";
import ChatButton from "@/components/chat-mentor-button";
import BookMentorButton from "@/components/book-mentor-button";
import Link from "next/link";

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

  

  return (
    <div className="min-h-screen bg-sky-100">
      <div className="min-w-screen min-h-screen max-w-screen mx-auto p-4 md:p-8">
        {/* Header Section */}
        <div className="mb-8">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="font-medium">Back to Mentors</span>
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/70 rounded-xl shadow-lg overflow-hidden">
          {/* Mentor Profile Section */}
          <div className="bg-white p-6 md:p-8 border-b border-sky-100">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Profile Avatar */}
              <div className="w-20 h-20 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-10 h-10 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>

              {/* Mentor Information */}
              <div className="flex-1 min-w-0">
                {/* Mentor Name */}
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                  {data_lengkap_mentor.username}
                </h1>

                {/* Mentor Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span>{mentor.total_rating}/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="bi bi-wallet2"></i>
                    <span>
                      Rp {mentor.harga_per_sesi.toLocaleString()}/sesi
                    </span>
                  </div>
                </div>

                {/* Quick Description Preview */}
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {mentor.deskripsi}
                </p>
              </div>

              {/* Chat Button */}
              <div className="flex-shrink-0">
                <div className="flex gap-2">
                  <ChatButton
                    receiver_id={mentor.user_id}
                    reciever_name={data_lengkap_mentor.username}
                  />
                  <BookMentorButton sesi={{
                    id: 0,
                    jam_mulai: "",
                    jam_selesai: "",
                    mentor_id: 0,
                    mentee_id: 0,
                    rating_ulasan: null,
                    deksripsi_ulasan: null,
                    link: "",
                    status: "Menunggu Konfirmasi"
                  }}/>
              </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-6 md:p-8">
            {/* Video Section */}
            {mentor.link_video && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
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
    </div>
  );
}
