'use client'
import Link from "next/link";
import MentorCard from "@/components/mentor_card";
import { GetAllMentors } from "@/app/api/get_all_mentors/route";
import { IMentor } from "@/types/mentor.md";

import { useEffect, useState } from "react";

export default function Home() {
  const [mentors, setMentors] = useState<IMentor[]>([]);

  useEffect(() => {
    GetAllMentors().then((data) => {
      setMentors(data);
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center">
      <Link href={"/login"}> login </Link>
      <Link href={"/register"}> register </Link>
      <Link href={"/chat"}> chat </Link>

      {mentors.map((mentor: IMentor) => (
        <MentorCard key={mentor.id} mentor_id={mentor.id} />
      ))}
    </div>
  );
}
