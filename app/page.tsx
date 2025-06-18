import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-screen items-center justify-center">
      <Link href={"/login"}> login </Link>
      <Link href={"/register"}> register </Link>
      <Link href={"/chat"}> chat </Link>
    </div>
  );
}
