"use client";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 px-6 bg-[#ffffff]  overflow-hidden ">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">About Us</h1>


            <div className="flex justify-center mb-8 overflow-hidden">
                <Image
                    src="/square.svg"
                    alt="Square icon"
                    width={100}
                    height={100}
                    className="w-[500px] h-auto absolute overflow-hidden
                    lg:rotate-168 lg:-left-[100px] lg:-bottom-[100px] z-10"
                />
                <Image
                    src="/square.svg"
                    alt="Square icon"
                    width={100}
                    height={100}
                    className="w-[500px] h-auto absolute overflow-hidden
                    lg:-rotate-148 lg:-left-[200px] lg:bottom-[350px] z-9"
                />
                <Image
                    src="/circle.svg"
                    alt="circle icon"
                    width={100}
                    height={100}
                    className="w-[1300px] h-auto absolute
                    lg:-rotate-0 lg:left-[200px] lg:-bottom-[100px] z-8"
                />
                <Image
                    src="/square.svg"
                    alt="Square icon"
                    width={100}
                    height={100}
                    className="w-[500px] h-auto absolute overflow-hidden
                    lg:rotate-143 lg:-right-[100px] lg:-bottom-[50px] z-10"
                />
                <Image
                    src="/square.svg"
                    alt="Square icon"
                    width={100}
                    height={100}
                    className="w-[500px] h-auto absolute overflow-hidden
                    lg:rotate-168 lg:-right-[200px] lg:top-[50px] z-9"
                />
            </div>


        <p className="text-gray-600 text-center">
          Welcome to our about page with the square icon above.
        </p>
    </div>
  );
}