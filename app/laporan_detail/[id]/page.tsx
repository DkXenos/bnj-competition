import supabase from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import TindakLanjutForm from "@/components/tindak-lanjut-form";

export default async function LaporanDetailPage({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  // Await the params object
  const { id } = await params;

  // Fetch specific permintaan data by id
  const { data: sesi } = await supabase
    .from("sesi")
    .select(`*`)
    .eq("id", id)
    .single();
  const {data: mentor_user_id} = await supabase
    .from("mentors")
    .select(`*`)
    .eq("id", sesi.mentor_id)
    .single();
  const { data: data_lengkap_mentor } = await supabase
    .from("users")
    .select(`*`)
    .eq("id", mentor_user_id.user_id)
    .single();

  const { data: data_lengkap_mentee } = await supabase
    .from("users")
    .select(`*`)
    .eq("id", sesi.mentee_id)
    .single();

  return (
    <div className="min-h-screen min-w-screen bg-sky-100">
      <div className="min-h-[0vh] md:min-h-[8vh] w-screen"></div>
      <div className="min-w-screen min-h-screen p-4 flex items-center">
        {/* Main Content Card */}
        <div className="bg-white/70 my-16 p-4 rounded-xl w-[70%] mx-auto shadow-lg overflow-hidden">
          {/* Mentor Profile Section */}
          <h1 className="text-black text-2xl">Laporan</h1>
          <p className="text-black">Dibuat oleh: </p>
            <p className="text-black font-bold">
                {data_lengkap_mentee.username}
            </p>
            <p className="text-black">Untuk Mentor: </p>
            <p className="text-black font-bold">
                {data_lengkap_mentor.username}
            </p>
          <p className="text-black">Deskripsi: </p>
          <p className="text-black font-bold h-[10rem]">
            {sesi.deksripsi_laporan}
          </p>
          {Array.isArray(sesi.bukti_masalah) && sesi.bukti_masalah.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-black mb-2">Bukti Masalah:</label>
                    <div className="flex flex-wrap gap-4">
                      {sesi.bukti_masalah.map((url: string, idx: number) => (
                        <div key={idx} className="relative h-96 w-96">
                          <Link
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="cursor-pointer"
                          >
                            <Image
                              src={url}
                              alt={`Bukti Masalah ${idx + 1}`}
                              layout="fill"
                              objectFit="cover"
                              className="rounded border border-gray-300 hover:opacity-90 transition-opacity"
                            />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Replace the textarea and button with the new component */}
                <TindakLanjutForm sesiId={sesi.id} />
        </div>
      </div>
    </div>
  );
}
