// "use client";
// import { IMentor } from "@/types/mentor.md";
// import { IUser } from "@/types/user.md";

// interface MentorCardProps {
//   mentor: IMentor;
//   user: IUser;
//   onClick?: () => void;
// }

// export default function MentorCard({ mentor, user, onClick }: MentorCardProps) {
//   return (
//     <div
//       onClick={onClick}
//       className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col cursor-pointer hover:shadow-md transition-shadow duration-200 min-h-[400px]"
//     >
//       {/* Profile Image Placeholder */}
//       <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
//         <svg
//           className="w-16 h-16 text-gray-400"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//           />
//         </svg>
//       </div>

//       {/* Mentor Info */}
//       <div className="flex-grow">
//         <h3 className="text-xl font-bold text-gray-900 mb-2">
//           {user.username
//             .split(" ")
//             .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(" ")}
//         </h3>
//         <p className="text-gray-600 text-sm line-clamp-3">
//           {mentor.deskripsi
//             .split(" ")
//             .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(" ")}
//         </p>
//       </div>

//       {/* Additional Info */}
//       <div className="mt-4 pt-4 border-t border-gray-100">
//         <div className="flex justify-between items-center text-sm text-gray-500">
//           <span>Rating: {mentor.total_rating}/5</span>
//           <span>Rp {mentor.harga_per_sesi.toLocaleString()}/sesi</span>
//         </div>
//       </div>
//     </div>
//   );
// }
