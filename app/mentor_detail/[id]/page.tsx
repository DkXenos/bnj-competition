import supabase from "@/lib/db";
import ChatButton from "@/components/chat-mentor-button"

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

   const {data: data_lengkap_mentor} = await supabase
    .from("users")
    .select(`*`)
    .eq("id", mentor.user_id)
    .single();

  return (
    <div>
      <div className="min-w-screen min-h-screen max-w-screen mx-auto p-8">
        <div className="flex flex-col gap-8 p-12 rounded-lg justify-start items-center w-full"></div>

        <div className="flex flex-col gap-8 p-12 rounded-lg shadow-lg justify-start items-start bg-[#414445] w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col pb-4 md:flex-row gap-2 md:items-center justify-between w-full">
            <h1 className="text-3xl text-white font-bold mb-4">{data_lengkap_mentor.username}</h1>
            <ChatButton receiver_id={mentor.user_id} reciever_name={data_lengkap_mentor.username}/>
            </div>
            <div className="mb-2">
              Deskripsi: <br className="mb-4"></br>
              {mentor.deskripsi}
            </div>
            {mentor.link_video && (
                <div className="mt-4 w-full h-full bg-white">
                    <div className="w-full h-full">
                        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                            <iframe
                                className="absolute top-0 left-0 w-full h-full"
                                src={
                                    mentor.link_video.includes("youtu.be")
                                        ? `https://www.youtube.com/embed/${mentor.link_video.split("youtu.be/")[1]}`
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
