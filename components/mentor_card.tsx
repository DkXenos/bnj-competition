'use client'
import { useRouter } from "next/navigation";
import supabase from "@/lib/db";
import { useEffect, useState } from "react";

export default function MentorCard({ mentor_id }: { mentor_id: number }) {
    
    const router = useRouter();
    const [mentor, setMentor] = useState<any>(null);

    const handleQuestClick = (id: number) => {
        router.push(`/mentor_detail/${id}`);
    };

    useEffect(() => {
        const fetchMentor = async () => {
            // Fetch mentor data with joined user data
            const { data: mentorData } = await supabase
                .from("mentors")
                .select("*, users(username)")
                .eq("id", mentor_id)
                .single();

            setMentor(mentorData);
        };
        fetchMentor();
    }, [mentor_id]);

    return (
        <div
            onClick={() => handleQuestClick(mentor_id)}
            className="bg-white border-black shadow-2xl min-w-[10rem] min-h-[10rem] rounded-lg"
        >
            <h1 className="text-black font-bold">{mentor ? mentor.rating : "Loading..."}</h1>
            <h1 className="text-gray-900">{mentor ? mentor.dekripsi : "Loading... deksripsi"}</h1>
        </div>
    );
}
