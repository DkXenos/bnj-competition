"use client";
import { useEffect, useState } from "react";
import { GetSesi } from "@/app/api/get_sesi/route";
import { ISesi } from "@/types/sesi.md";

export default function Schedule() {
  const [sesi, setSesi] = useState<ISesi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSesi = async () => {
      try {
        const data = await GetSesi();
        setSesi(data);
      } catch (error) {
        console.error("Error fetching sesi:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSesi();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Group sessions by date
  const groupedByDate = sesi.reduce((acc, session) => {
    const date = new Date(session.jam_mulai).toISOString().split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {} as Record<string, ISesi[]>);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Slot/Date</th>
            {Object.keys(groupedByDate).map((date) => (
              <th key={date} className="border border-gray-300 px-4 py-2">
                {date}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 16 }, (_, i) => {
            const hour = 7 + i; // Start from 7:00 AM
            const timeSlot = `${hour.toString().padStart(2, "0")}:00:00`;
            return (
              <tr key={timeSlot}>
                <td className="border border-gray-300 px-4 py-2">{timeSlot}</td>
                {Object.keys(groupedByDate).map((date) => {
                  const session = groupedByDate[date].find(
                    (s) =>
                      new Date(s.jam_mulai).toISOString().split("T")[1] <=
                        timeSlot &&
                      new Date(s.jam_selesai).toISOString().split("T")[1] >=
                        timeSlot
                  );
                  return (
                    <td
                      key={`${date}-${timeSlot}`}
                      className={`border border-gray-300 px-4 py-2 ${
                        session ? "bg-blue-500 text-white" : ""
                      }`}
                    >
                     
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}