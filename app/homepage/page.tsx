import Image from "next/image";
import Link from "next/link";
import Navbar from '@/components/navbar';
import Carousel from '@/components/carousel';
import MentorSection from '@/components/mentor-section';


export default function Homepage() {
  return (
    <div className="flex min-h-screen bg-[#F8F8F8] flex-col w-screen items-center justify-center">
      
      <div className="py-6 min-w-screen">
        <Carousel />
      </div>
      
      <MentorSection />
    </div>
  );
}
