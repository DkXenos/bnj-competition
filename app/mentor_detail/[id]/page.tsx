import { notFound } from "next/navigation";
import supabase from "@/lib/db";
import { useUser } from "@/context/UserContext";


export default async function MentorDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  // Await the params object
  const { id } = await params;
  const { loggedInUser } = useUser();

  // Fetch specific permintaan data by id
  const { data: mentor, error } = await supabase
    .from("mentors")
    .select(`*`)
    .eq("id", id)
    .single();

  const { data: user } = await supabase
    .from("users")
    .select(`*`)
    .eq("id", loggedInUser?.id)
    .single();

  return (
    <div>
      <div className="min-w-screen min-h-screen max-w-screen mx-auto p-8">
        <div className="flex flex-col gap-8 p-12 rounded-lg justify-start items-center w-full"></div>

        <h1 className="text-3xl font-bold mb-4">Detail Permintaan</h1>

        <div className="flex flex-col gap-8 p-12 rounded-lg shadow-lg justify-start items-start bg-[#CDEBF3] w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col pb-4 md:flex-row gap-2 md:items-center justify-between w-full">
            <h1 className="text-3xl font-bold mb-4">{mentor.username}</h1>
            </div>
            <div className="mb-2">
              Deskripsi: <br className="mb-4"></br>
              {mentor.deskripsi}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold mb-4">Kontak</h2>
            <div className="mb-2">Nama: {user.username}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
