'use client'
import { useUser } from "@/context/UserContext";
export default function DompetPage() {
    const { loggedInUser } = useUser();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100">
        <div className="min-h-[0vh] md:min-h-[6vh]"></div>
        <div className="flex flex-col gap-4 bg-white p-2 sm:p-4 w-[70%] min-h-[35rem] rounded-lg shadow-lg">
            <div className="flex gap-2 sm:gap-4 items-center">
                <i className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center bi bi-wallet2"></i>
                <h1 className="text-black text-lg sm:text-2xl font-bold">Dompetku</h1>
            </div>
            <div className="bg-gray-50 border-1 border-gray-50 shadow-md p-2 sm:p-4 w-full rounded-lg flex flex-col gap-2 sm:gap-4">
                <div>
                    <h1 className="text-lg sm:text-2xl text-gray-800 mb-2 sm:mb-4">Saldo Anda</h1>
                    <p className="text-gray-600 font-bold text-lg sm:text-2xl">Rp. {loggedInUser?.saldo}</p>
                </div>
            </div>
            <div className="bg-gray-50 border-1 border-gray-50 shadow-md p-2 sm:p-4 w-full rounded-lg flex flex-col gap-2 sm:gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg sm:text-2xl text-gray-800 mb-2 sm:mb-4">Saldo Ditahan</h1>
                        <p className="text-gray-600 font-bold text-lg sm:text-2xl">Rp.0</p>
                    </div>
                    <i className="bi bi-arrow-right text-blue-500 text-xl sm:text-2xl"></i>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4 h-full items-center justify-center">
                <div className="bg-blue-500 shadow-lg rounded-lg p-2 sm:p-4 w-full h-full flex justify-center gap-2 sm:gap-4">
                    <h1 className="text-lg sm:text-2xl text-center text-white">Tarik Saldo</h1>
                    <i className="text-lg sm:text-2xl bi bi-arrow-bar-up text-white"></i>
                </div>
                <div className="bg-blue-500 shadow-lg rounded-lg p-2 sm:p-4 w-full h-full flex justify-center gap-2 sm:gap-4">
                    <h1 className="text-lg sm:text-2xl text-center text-white">Isi Saldo</h1>
                    <i className="text-lg sm:text-2xl bi bi-arrow-bar-up text-white"></i>
                </div>
            </div>
            <h1 className="text-black text-lg sm:text-2xl font-bold">Transaksi Terakhir</h1>
            <div className="w-full overflow-x-auto relative">
                <div className="flex gap-2 sm:gap-4 w-max pb-2 sm:pb-4">
                    {/* transaksi 1 */}
                    <div className="bg-gray-50 border-1 border-gray-50 shadow-md p-2 sm:p-4 min-w-[12rem] sm:min-w-[16rem] rounded-lg flex flex-col gap-2 sm:gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg sm:text-2xl text-gray-800 mb-2 sm:mb-4">
                                    Mentoring Dengan Yen
                                </h1>
                                <p className="text-gray-600 font-bold text-lg sm:text-2xl">Rp.0</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 border-1 border-gray-50 shadow-md p-2 sm:p-4 min-w-[12rem] sm:min-w-[16rem] rounded-lg flex flex-col gap-2 sm:gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg sm:text-2xl text-gray-800 mb-2 sm:mb-4">
                                    Mentoring Dengan Yen
                                </h1>
                                <p className="text-gray-600 font-bold text-lg sm:text-2xl">Rp.0</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 border-1 border-gray-50 shadow-md p-2 sm:p-4 min-w-[12rem] sm:min-w-[16rem] rounded-lg flex flex-col gap-2 sm:gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg sm:text-2xl text-gray-800 mb-2 sm:mb-4">
                                    Mentoring Dengan Yen
                                </h1>
                                <p className="text-gray-600 font-bold text-lg sm:text-2xl">Rp.0</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 border-1 border-gray-50 shadow-md p-2 sm:p-4 min-w-[12rem] sm:min-w-[16rem] rounded-lg flex flex-col gap-2 sm:gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg sm:text-2xl text-gray-800 mb-2 sm:mb-4">
                                    Mentoring Dengan Yen
                                </h1>
                                <p className="text-gray-600 font-bold text-lg sm:text-2xl">Rp.0</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 border-1 border-gray-50 shadow-md p-2 sm:p-4 min-w-[12rem] sm:min-w-[16rem] rounded-lg flex flex-col gap-2 sm:gap-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg sm:text-2xl text-gray-800 mb-2 sm:mb-4">
                                    Mentoring Dengan Yen
                                </h1>
                                <p className="text-gray-600 font-bold text-lg sm:text-2xl">Rp.0</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
