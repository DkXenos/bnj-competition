import supabase from "@/lib/db";
import TindakLanjutForm from "@/components/tindak-lanjut-form";
import EvidenceSection from "@/components/evidence-section";

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-[6vh] md:min-h-[8vh] w-screen"></div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden border border-gray-100">
          {/* Header Banner */}
          <div className="bg-sky-100 text-black p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Laporan Masalah Sesi
                </h1>
                <p className="text-black text-sm md:text-base">
                  Nomor Laporan: ID-{String(id).padStart(6, '0')}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white text-black border border-white/20 backdrop-blur-sm">
                  <i className="bi bi-file-earmark-text mr-2"></i>
                  {sesi.status_laporan}
                </span>
              </div>
            </div>
          </div>

          {/* Report Metadata */}
          <div className="p-6 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <i className="bi bi-calendar3 text-blue-600"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Tanggal Sesi</p>
                  <p className="text-gray-800 font-semibold">
                    {formatDate(sesi.jam_mulai)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <i className="bi bi-clock text-blue-600"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Durasi Sesi</p>
                  <p className="text-gray-800 font-semibold">
                    {new Date(sesi.jam_mulai).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} - {new Date(sesi.jam_selesai).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <i className="bi bi-file-earmark-text text-blue-600"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">ID Sesi</p>
                  <p className="text-gray-800 font-semibold">
                    {sesi.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Report Content */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Stakeholder Information */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="bi bi-people text-slate-600"></i>
              Informasi Pihak Terkait
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pelapor (Mentee) */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-100 p-2 rounded-full">
                    <i className="bi bi-person-exclamation text-orange-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Pelapor</h3>
                    <p className="text-sm text-gray-600">Mentee</p>
                  </div>
                </div>
                <p className="text-gray-800 font-medium">{data_lengkap_mentee.username}</p>
                <p className="text-sm text-gray-600">{data_lengkap_mentee.email}</p>
              </div>

              {/* Terlapor (Mentor) */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <i className="bi bi-person-badge text-blue-600"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Terlapor</h3>
                    <p className="text-sm text-gray-600">Mentor</p>
                  </div>
                </div>
                <p className="text-gray-800 font-medium">{data_lengkap_mentor.username}</p>
                <p className="text-sm text-gray-600">{data_lengkap_mentor.email}</p>
              </div>
            </div>
          </div>

          {/* Report Description */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="bi bi-chat-quote text-slate-600"></i>
              Deskripsi Masalah
            </h2>
            
            <div className="bg-gray-100 border-l-4 border-sky-100 rounded-lg p-6">
              <div className="prose prose-gray max-w-none">
                <p className="text-black leading-relaxed text-base">
                  {sesi.deksripsi_laporan || "Tidak ada deskripsi masalah yang diberikan."}
                </p>
              </div>
            </div>
          </div>

          {/* Evidence Section */}
          {Array.isArray(sesi.bukti_masalah) && sesi.bukti_masalah.length > 0 && (
            <EvidenceSection buktiMasalah={sesi.bukti_masalah} />
          )}

          {/* Follow-up Section */}
          {sesi.status_laporan === "Ditindak Lanjuti" && sesi.deskripsi_tindak_lanjut && (
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="bi bi-check-circle text-slate-600"></i>
                Tindak Lanjut
              </h2>
              
              <div className="bg-green-50 border-l-4 border-green-400 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg mt-1 shadow-sm">
                    <i className="bi bi-gear text-green-600"></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Hasil Tindak Lanjut</h3>
                    <p className="text-gray-800 leading-relaxed">
                      {sesi.deskripsi_tindak_lanjut}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Section - Only show if not yet handled */}
          {sesi.status_laporan === "Laporan Dikirim" && (
            <div className="p-6 bg-slate-50">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="bi bi-tools text-slate-600"></i>
                Tindakan Admin
              </h2>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <TindakLanjutForm sesiId={sesi.id} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <i className="bi bi-shield-check"></i>
            <span>Laporan ini bersifat rahasia dan hanya dapat diakses oleh admin MentorPact</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            © 2024 MentorPact - Sistem Manajemen Laporan
          </p>
        </div>
      </div>
    </div>
  );
}