import { ISesi } from "@/types/sesi.md";
import { useEffect, useState } from "react";
import supabase from "@/lib/db";
import { useUser } from "@/context/UserContext";
import { confirmSession, SubmitReview } from "@/lib/sesi";
import Link from "next/link";
import Image from "next/image";

export default function JadwalCard({ sesi }: { sesi: ISesi }) {
  const [currentSesi, setCurrentSesi] = useState(sesi);
  const [name, setName] = useState<string>("Loading...");
  const { loggedInUser } = useUser();
  const [showRejectPopup, setShowRejectPopup] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showAcceptPopup, setShowAcceptPopup] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewDescription, setReviewDescription] = useState("");
  // Tambahkan state untuk Report
  const [showReportPopup, setShowReportPopup] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportFiles, setReportFiles] = useState<File[]>([]);
  const [reportFilePreviews, setReportFilePreviews] = useState<string[]>([]);
  const [isUserMentor, setIsUserMentor] = useState(false);

  useEffect(() => {
    const checkAndUpdateStatus = async () => {
      // Only check status for confirmed sessions
      if (currentSesi.status !== "Terkonfirmasi") return;

      const now = new Date();
      const jamMulai = new Date(currentSesi.jam_mulai);
      const jamSelesai = new Date(currentSesi.jam_selesai);
      let newStatus: ISesi["status"] | null = null;

      if (now > jamSelesai) {
        newStatus = "Selesai";
      } else if (now >= jamMulai) {
        newStatus = "Dilaksanakan";
      }

      if (newStatus) {
        const { error } = await supabase
          .from("sesi")
          .update({ status: newStatus })
          .eq("id", currentSesi.id);

        if (!error) {
          setCurrentSesi((prev) => ({ ...prev, status: newStatus! }));
        }
      }
    };

    checkAndUpdateStatus();
  }, [
    currentSesi.id,
    currentSesi.status,
    currentSesi.jam_mulai,
    currentSesi.jam_selesai,
  ]);

  useEffect(() => {
    const fetchName = async () => {
      try {
        // First check if the logged-in user is the mentor for this session
        const { data: mentorData, error: mentorError } = await supabase
          .from("mentors")
          .select("user_id")
          .eq("id", currentSesi.mentor_id)
          .single();
        
        if (mentorError) {
          console.error("Error fetching mentor data:", mentorError);
          setName("Unknown");
          return;
        }
        
        // Determine if the logged-in user is the mentor
        const isUserMentor = mentorData.user_id === loggedInUser?.id;
        
        // Now fetch the name of the other person
        let targetUserId;
        if (isUserMentor) {
          // User is the mentor, show mentee name
          targetUserId = currentSesi.mentee_id;
          
          // This will be displayed as "Mentee: [name]"
        } else {
          // User is the mentee, show mentor name
          targetUserId = mentorData.user_id;
          
          // This will be displayed as "Mentor: [name]"
        }
        
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("id", targetUserId)
          .single();

        if (error) {
          console.error("Error fetching name:", error);
          setName("Unknown");
          return;
        }

        setName(data?.username || "Unknown");
        
        // Set a state to track if user is mentor (for conditional rendering)
        setIsUserMentor(isUserMentor);
      } catch (error) {
        console.error("Unexpected error:", error);
        setName("Unknown");
      }
    };

    fetchName();
  }, [currentSesi.mentor_id, currentSesi.mentee_id, loggedInUser?.id]);

  const handleAccept = () => {
    setShowAcceptPopup(true);
  };

  const submitAcceptance = async () => {
    if (!meetingLink.trim() || !meetingLink.startsWith("http")) {
      alert(
        "Harap masukkan link meeting yang valid (contoh: https://zoom.us/...)."
      );
      return;
    }

    try {
      const result = await confirmSession(currentSesi.id, meetingLink);

      if (!result.success) {
        alert(`Gagal mengonfirmasi sesi: ${result.error}`);
        return;
      }

      alert(result.message);
      setCurrentSesi((prev) => ({
        ...prev,
        status: "Terkonfirmasi",
        link: meetingLink,
      }));
      setShowAcceptPopup(false);
      setMeetingLink("");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Terjadi kesalahan saat mengonfirmasi sesi.");
    }
  };

  const handleReject = () => {
    setShowRejectPopup(true);
  };

  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      alert("Alasan penolakan tidak boleh kosong.");
      return;
    }
    try {
      const { error } = await supabase
        .from("sesi")
        .update({ status: "Ditolak", alasan_ditolak: rejectReason })
        .eq("id", currentSesi.id);

      if (error) {
        console.error("Error updating status:", error);
        alert("Gagal menolak sesi.");
        return;
      }

      alert("Sesi berhasil ditolak!");
      setCurrentSesi((prev) => ({
        ...prev,
        status: "Ditolak",
        alasan_ditolak: rejectReason,
      }));
      setShowRejectPopup(false);
      setRejectReason("");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Terjadi kesalahan tak terduga.");
    }
  };

  const handleReportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Convert FileList to array and filter by type
    const filesArray = Array.from(files);
    const imageFiles = filesArray.filter((file) => file.type.startsWith("image/"));

    // Check file size (limit to 5MB per file)
    const validFiles = imageFiles.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} terlalu besar (maks 5MB).`);
        return false;
      }
      return true;
    });

    setReportFiles((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setReportFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Add function to remove a selected file
  const removeReportFile = (index: number) => {
    setReportFiles((prev) => prev.filter((_, i) => i !== index));

    // Revoke the URL to prevent memory leaks
    URL.revokeObjectURL(reportFilePreviews[index]);
    setReportFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Add this function to upload files to Supabase
  const uploadReportFilesToSupabase = async (files: File[]) => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      try {
        // Create a unique file path with timestamp and original file name
        const filePath = `reports/${Date.now()}-${file.name}`;
        
        // Upload the file to Supabase storage
        const { error } = await supabase.storage
          .from("laporan")
          .upload(filePath, file);

        if (error) {
          console.error("Error uploading file:", {
            message: error.message,
            name: error.name,
          });
          alert(`Error uploading file ${file.name}: ${error.message}`);
          continue;
        }

        // Get the public URL after successful upload
        const { data: publicUrlData } = supabase.storage
          .from("laporan")
          .getPublicUrl(filePath);

        if (!publicUrlData?.publicUrl) {
          alert(`Failed to get public URL for ${file.name}`);
          continue;
        }

        // Add the URL to our array
        uploadedUrls.push(publicUrlData.publicUrl);
      } catch (err) {
        console.error("Unexpected error during upload:", err);
        alert(`Unexpected error uploading file ${file.name}`);
      }
    }

    return uploadedUrls;
  };

  // Modify your submitReport function
  const submitReport = async () => {
    if (!reportReason.trim()) {
      alert("Alasan laporan tidak boleh kosong.");
      return;
    }

    try {
      // Upload any attached files
      const uploadedUrls = await uploadReportFilesToSupabase(reportFiles);

      // Update the session with report details and uploaded file URLs
      const { error } = await supabase
        .from("sesi")
        .update({
          status: "Bermasalah",
          deksripsi_laporan: reportReason,
          status_laporan: "Laporan Dikirim",
          bukti_masalah: uploadedUrls, // Keep as array
        })
        .eq("id", currentSesi.id);

      if (error) {
        console.error("Error updating status:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        alert("Gagal melaporkan sesi: " + error.message);
        return;
      }

      setCurrentSesi((prev) => ({
        ...prev,
        status: "Bermasalah",
        deksripsi_laporan: reportReason,
        status_laporan: "Laporan Dikirim",
        bukti_masalah: uploadedUrls, // Keep as array, don't convert to string
      }));
      setShowReportPopup(false);
      setReportReason("");
      setReportFiles([]);
      setReportFilePreviews([]);

      alert("Laporan berhasil dikirim!");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Terjadi kesalahan tak terduga.");
    }
  };

  const label = isUserMentor ? "Mentee" : "Mentor";

  return (
    <div className="relative flex flex-col justify-center items-center min-w-[300px] bg-white border-1 rounded-lg shadow-lg p-6">
      <div className="gap-2 h-full flex flex-col justify-between">
        <h2 className="text-black text-lg font-bold mb-2">
          {" "}
          {label}: {name.charAt(0).toUpperCase() + name.slice(1)}
        </h2>
        <h1 className="text-gray-600 mb-1">
          {(() => {
            const mulai = new Date(currentSesi.jam_mulai);
            const selesai = new Date(currentSesi.jam_selesai);

            // Format tanggal: Jumat, 20 Juni 2025
            const tanggal = mulai.toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
              weekday: "long",
            });

            // Format jam: 14:00 - 15:00
            const jam = `${mulai.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })} - ${selesai.toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}`;

            return (
              <>
                {tanggal}
                <br />
                {jam}
              </>
            );
          })()}
        </h1>
        {loggedInUser?.id === currentSesi.mentee_id &&
          (["Terkonfirmasi", "Selesai", "Dilaksanakan", "Bermasalah"].includes(
            currentSesi.status
          ) && currentSesi.link ? (
            <div className="space-x-1">
              <i className="bi bi-link-45deg text-blue-500"></i>
              <Link
                href={currentSesi.link}
                className="mb-1 text-center w-full text-blue-500 hover:cursor-pointer hover:underline"
              >
                Link meeting
              </Link>
            </div>
          ) : (
            <div className="space-x-1">
              <i className="bi bi-link-45deg text-gray-400"></i>
              <span className="mb-1 text-center w-full text-gray-400 cursor-not-allowed select-none">
                Link meeting
              </span>
            </div>
          ))}
        {currentSesi.status === "Ditolak" && currentSesi.alasan_ditolak && (
          <div className="space-x-1">
            <div className="mt-1 text-sm text-red-700">
              Alasan: {currentSesi.alasan_ditolak}
            </div>
          </div>
        )}

        {/* Add this new condition to display tindak lanjut details */}
        {currentSesi.status_laporan === "Ditindak Lanjuti" && currentSesi.deskripsi_tindak_lanjut && (
          <div className="space-x-1">
            <div className="mt-1 text-sm text-yellow-700">
              <span className="font-semibold">Tindak Lanjut:</span> {currentSesi.deskripsi_tindak_lanjut}
            </div>
          </div>
        )}

        {loggedInUser?.id === currentSesi.mentee_id &&
          currentSesi.status === "Selesai" && (
            <>
              {currentSesi.rating_ulasan === null ? (
                <button
                  onClick={() => setShowReviewPopup(true)}
                  className="text-blue-500 hover:underline hover:cursor-pointer"
                >
                  Beri ulasan
                </button>
              ) : (
                <div className="text-sm text-gray-600 text-center w-full">
                  <p className="font-semibold">Ulasan Anda:</p>
                  <div className="flex items-center justify-center gap-1">
                    <i className="bi bi-star-fill text-yellow-400"></i>
                    <span>{currentSesi.rating_ulasan}/5</span>
                  </div>
                  {currentSesi.deskripsi_ulasan && (
                    <p className="mt-1 italic">
                      &quot;{currentSesi.deskripsi_ulasan}&quot;
                    </p>
                  )}
                </div>
              )}
            </>
          )}

        {/* Tombol Report */}
        {(loggedInUser?.id === currentSesi.mentor_id || 
          loggedInUser?.id === currentSesi.mentee_id) &&
          [ "Dilaksanakan", "Selesai"].includes(currentSesi.status) && (
            <button
              onClick={() => setShowReportPopup(true)}
              className="text-red-500 text-sm hover:underline hover:cursor-pointer flex items-center gap-1 justify-center"
            >
              <i className="bi bi-exclamation-triangle-fill"></i>
              <p className="text-center">
              Laporkan Masalah
              </p>
            </button>
        )}

        <span
          className={`px-3 py-2 rounded-lg text-xs font-semibold ${
            currentSesi.status === "Terkonfirmasi"
              ? "bg-green-100 text-green-700"
              : currentSesi.status === "Ditolak" ||
                currentSesi.status === "Bermasalah"
              ? "bg-red-100 text-red-700"
              : currentSesi.status === "Selesai"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {currentSesi.status}
        </span>
        
        {/* Buttons for Mentor */}
        {isUserMentor && currentSesi.status === "Menunggu Konfirmasi" && (
          <div className="flex w-full gap-2 mt-4">
            <button
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleAccept}
            >
              Terima
            </button>
            <button
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={handleReject}
            >
              Tolak
            </button>
          </div>
        )}
      </div>

      {/* Acceptance Confirmation Popup */}
      {showAcceptPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold text-center mb-4 text-black">
              Terima Sesi & Masukkan Link
            </h1>
            <p className="text-gray-600 text-center mb-4">
              Pastikan Anda bisa di jam tersebut. Masukkan link meeting (Zoom,
              Google Meet, dll.) untuk sesi ini.
            </p>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://zoom.us/j/..."
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowAcceptPopup(false);
                  setMeetingLink(""); // Reset on cancel
                }}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={submitAcceptance}
                disabled={!meetingLink.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Terima & Kirim Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Popup */}
      {showRejectPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold text-center mb-4 text-black">
              Alasan Penolakan Sesi
            </h1>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Tuliskan alasan Anda menolak sesi ini..."
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowRejectPopup(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Tolak Sesi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Popup */}
      {showReviewPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h1 className="text-xl font-bold text-center mb-4 text-black">
              Beri Ulasan untuk Sesi Ini
            </h1>

            {/* Star Rating */}
            <div className="flex justify-center items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`bi bi-star-fill cursor-pointer text-3xl transition-colors ${
                    (hoverRating || rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                ></i>
              ))}
            </div>

            {/* Review Description */}
            <textarea
              value={reviewDescription}
              onChange={(e) => setReviewDescription(e.target.value)}
              placeholder="Tuliskan ulasan Anda (opsional)..."
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowReviewPopup(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  const result = await SubmitReview(
                    currentSesi.id,
                    rating,
                    reviewDescription,
                    sesi.mentor_id
                  );
                  if (result.success) {
                    alert(result.message || "Ulasan berhasil dikirim!");
                    setCurrentSesi((prev) => ({
                      ...prev,
                      rating_ulasan: rating,
                      deskripsi_ulasan: reviewDescription,
                    }));
                    setShowReviewPopup(false);
                  } else {
                    alert(result.error || "Gagal mengirim ulasan.");
                  }
                }}
                disabled={rating === 0}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Kirim Ulasan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Popup */}
      {showReportPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h1 className="text-xl font-bold text-center mb-4 text-black">
              Laporkan Masalah
            </h1>
            <p className="text-gray-600 text-sm mb-4">
              Jelaskan masalah yang Anda alami dengan sesi ini. Tim kami akan segera meninjau laporan Anda.
            </p>
            
            {/* Report reason textarea */}
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Tuliskan masalah yang Anda alami dengan sesi ini..."
              className="w-full p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              rows={4}
            />
            
            {/* File upload section */}
            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Bukti Masalah (wajib)</label>
              <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-center bg-gray-50">
                <input
                  onChange={handleReportFileChange}
                  type="file"
                  name="bukti_masalah"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="upload-bukti"
                />
                <label
                  htmlFor="upload-bukti"
                  className="cursor-pointer flex flex-col items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                >
                  <i className="bi bi-image text-3xl"></i>
                  <span className="mt-2 text-sm">Klik untuk mengunggah bukti (gambar)</span>
                </label>
              </div>
            </div>
            
            {/* File previews */}
            {reportFilePreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {reportFilePreviews.map((preview, index) => (
                  <div key={index} className="relative h-24 border border-gray-300 rounded-lg overflow-hidden">
                    <Image 
                      width={500}
                      height={500}
                      key={index}
                      
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeReportFile(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      <i className="bi bi-x-lg text-xs"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowReportPopup(false);
                  setReportReason("");
                  setReportFiles([]);
                  setReportFilePreviews([]);
                }}
                className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={submitReport}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Laporkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
