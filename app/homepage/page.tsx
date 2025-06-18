import Image from "next/image";
import Link from "next/link";
import Navbar from '@/components/navbar';
import Carousel from '@/components/carousel';


export default function Homepage() {
  return (
    <div className="flex bg-[#F8F8F8] flex-col w-screen items-center justify-center">
      <Navbar />
      <Carousel />
    </div>
  );
}
