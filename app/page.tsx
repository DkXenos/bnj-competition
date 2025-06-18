import Link from "next/link";
import MentorCard from "@/components/mentor_card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center">
      <Link href={"/login"}> login </Link>
      <Link href={"/register"}> register </Link>
      <Link href={"/chat"}> chat </Link>

      <MentorCard mentor_id={1}/>
    </div>
  );
}
