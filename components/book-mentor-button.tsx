import { ISesi } from "@/types/sesi.md";
import { IUser } from "@/types/user.md";

export default function BookMentorButton({
  sesi,
}: {
  sesi: ISesi;
}) {
  return (
    <button
      className="bg-sky-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-600 transition-colors flex items-center gap-2"
    >
      <i className="bi bi-calendar-check"></i>Jadwalkan
    </button>
  );
}
