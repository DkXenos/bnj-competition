'use client'
import Link from "next/link";
import MentorCard from "@/components/mentor_card";
import { GetAllMentors } from "@/app/api/get_all_mentors/route";
import { IMentor } from "@/types/mentor.md";
import Homepage from "@/app/homepage/page";

import { useEffect, useState } from "react";

export default function Home() {
  const [mentors, setMentors] = useState<IMentor[]>([]);

  useEffect(() => {
    GetAllMentors().then((data) => {
      setMentors(data);
    });
  }, []);

  return (
    <div>
      <Homepage />
    </div>
  );
}
