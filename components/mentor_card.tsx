'use client'
import { useRouter } from "next/navigation";
import supabase from "@/lib/db";
import { useEffect, useState } from "react";
import { IMentor } from "@/types/mentor.md";
import { IUser } from "@/types/user.md";

export default function MentorCard({ mentor_id }: { mentor_id: number }) {
    
    const router = useRouter();
    const [mentor, setMentor] = useState<IMentor>();
    const [mentorDataLengkap, setMentorDataLengkap] = useState<IUser>();

    const handleQuestClick = (id: number) => {
        router.push(`/mentor_detail/${id}`);
    };

    useEffect(() => {
        const fetchMentor = async () => {
            // Fetch mentor data with joined user data
            const { data: mentorData } = await supabase
                .from("mentors")
                .select("*")
                .eq("id", mentor_id)
                .single();
            if (!mentorData) {
                console.error("Mentor not found");
                return;
            }
            setMentor(mentorData);
        };
        fetchMentor();
    }, [mentor_id]);

    useEffect(() => {
        const fetchMentor = async () => {
            // Fetch mentor data with joined user data
            const { data: mentorDataLengkap } = await supabase
                .from("users")
                .select("*")
                .eq("id", mentor?.user_id)
                .single();
            setMentorDataLengkap(mentorDataLengkap);
        };
        fetchMentor();
    });

    return (
        <div
            onClick={() => handleQuestClick(mentor_id)}
            className="bg-white border-black shadow-2xl min-w-[15rem] min-h-[15rem] p-4 rounded-lg flex items-start justify-center gap-4 flex-col hover:cursor-pointer"
        >
            <h1 className="text-black font-bold">{mentorDataLengkap?.username}</h1>
            <h1 className="text-gray-900">{mentor ? mentor.deskripsi : "Loading... deksripsi"}</h1>
        </div>
    );
}
