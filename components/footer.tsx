import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full h-auto text-black bg-[#f5f5f5] pt-16">
      <div className="container mx-auto text-center">
        <Image
          src={"/MP-logo.svg"}
          alt={"Logo MP"}
          width={80}
          height={80}
          className="w-24 h-auto pb-4 object-cover"
        />
        <p className="text-sm align-right">lorem ipsum.</p>
        <p className="text-xs mt-2">Made by ur mom</p>
      </div>
    </footer>
  );
}
