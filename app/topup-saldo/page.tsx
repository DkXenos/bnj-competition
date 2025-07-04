'use client'
import { useState } from "react";
import * as transaction from "@/lib/transaction";
import { useUser } from "@/context/UserContext";

// Payment method icons as components
const PaymentIcons = {
  OVO: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#4C2A86" />
      <path d="M12 5C8.53757 5 6 7.53757 6 11V13C6 16.4624 8.53757 19 12 19C15.4624 19 18 16.4624 18 13V11C18 7.53757 15.4624 5 12 5ZM12 17C9.64416 17 8 15.3558 8 13C8 10.6442 9.64416 9 12 9C14.3558 9 16 10.6442 16 13C16 15.3558 14.3558 17 12 17Z" fill="white" />
    </svg>
  ),
  QRIS: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="2" fill="#E6162D" />
      <path d="M5 5H10V10H5V5ZM14 5H19V10H14V5ZM5 14H10V19H5V14ZM16 14V15.5H14.5V14H13V17H14.5V18.5H16V20H17.5V14H16ZM18 17V18.5H19V17H18ZM18 14V15.5H19V14H18Z" fill="white" />
      <rect x="7" y="7" width="1" height="1" fill="#E6162D" />
      <rect x="16" y="7" width="1" height="1" fill="#E6162D" />
      <rect x="7" y="16" width="1" height="1" fill="#E6162D" />
    </svg>
  ),
  BCA: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#005BAA" />
      <path d="M7 10C8.10457 10 9 9.10457 9 8C9 6.89543 8.10457 6 7 6C5.89543 6 5 6.89543 5 8C5 9.10457 5.89543 10 7 10Z" fill="#FFFFFF" />
      <path d="M17 10C18.1046 10 19 9.10457 19 8C19 6.89543 18.1046 6 17 6C15.8954 6 15 6.89543 15 8C15 9.10457 15.8954 10 17 10Z" fill="#FFFFFF" />
      <path d="M12 11L9 14H15L12 11Z" fill="#FFFFFF" />
      <rect x="7" y="14" width="10" height="4" rx="1" fill="#FFFFFF" />
    </svg>
  ),
  GoPay: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#00AAD2" />
      <path d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C12.9319 7 13.8066 7.28317 14.5 7.76777" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="white" />
      <path d="M16 8L17 9L19 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
};

export default function TopUpSaldoPage(){
    const methods = ["OVO", "QRIS", "BCA", "GoPay"];
    const [selected, setSelected] = useState<string | null>(null);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const amounts = [20000, 50000, 100000];
    const { loggedInUser } = useUser();

    const handleTopUpClick = () => {
        if (!selected || !selectedAmount) {
            alert("Silakan pilih nominal dan metode top up terlebih dahulu.");
            return;
        }
        setShowConfirmation(true);
    };

    const handleConfirmTopUp = async () => {
        setIsProcessing(true);
        try {
            await transaction.TopUpSaldo(Number(loggedInUser?.id), selectedAmount!, selected!);
            setShowConfirmation(false);
            setShowSuccess(true);
            
            // Auto redirect after 3 seconds
            setTimeout(() => {
                window.location.href = "/user_dashboard";
            }, 3000);
        } catch (error) {
            console.error("Error during top up:", error);
            alert("Terjadi kesalahan saat melakukan top up.");
            setIsProcessing(false);
        }
    };

    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
    };

    return(
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100">
                <div className="w-screen h-[6vh]"></div>
                <div className="w-[70%] md:w-fit bg-white rounded-xl shadow-lg p-4 flex flex-col items-center">
                    <h1 className="text-lg md:text-2xl font-bold mb-4 text-black">Top Up Saldo</h1>
                    <p className="text-sm md:text-lg text-gray-600 mb-6">Silakan pilih nominal dan metode top up yang Anda inginkan.</p>
                    <div className="w-full max-w-lg">
                        {/* Amount selection section */}
                        <label className="block text-gray-700 font-semibold mb-2">
                            Pilih Nominal Top Up
                        </label>
                        <div className="flex flex-col gap-3 mb-6">
                            {amounts.map((amount) => (
                                <button
                                    key={amount}
                                    className={`flex-1 border rounded-lg p-3 gap-2 flex items-center justify-start transition
                                        ${selectedAmount === amount
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "bg-gray-200 text-black border-gray-300 hover:bg-blue-100"}
                                    `}
                                    type="button"
                                    onClick={() => setSelectedAmount(amount)}
                                >
                                    <i className="bi bi-chevron-right"></i>
                                    <span className="font-medium text-left">Rp {amount.toLocaleString()}</span>
                                </button>
                            ))}
                        </div>
                        
                        <label className="block text-gray-700 font-semibold mb-2">
                            Pilih Metode Top Up
                        </label>
                        <div className="flex flex-col gap-3 mb-6">
                            {methods.map((method) => (
                                <button
                                    key={method}
                                    className={`w-full border rounded-lg p-3 flex items-center transition
                                        ${selected === method
                                            ? "bg-blue-500 text-white border-blue-500"
                                            : "bg-gray-200 text-black border-gray-300 hover:bg-blue-100"}
                                    `}
                                    type="button"
                                    onClick={() => setSelected(method)}
                                >
                                    <div className="mr-3">
                                        {method === "OVO" && <PaymentIcons.OVO />}
                                        {method === "QRIS" && <PaymentIcons.QRIS />}
                                        {method === "BCA" && <PaymentIcons.BCA />}
                                        {method === "GoPay" && <PaymentIcons.GoPay />}
                                    </div>
                                    <span className="font-medium">{method}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            disabled={!selected || !selectedAmount}
                            onClick={handleTopUpClick}
                        >
                            Top Up Sekarang
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                        <h1 className="text-xl font-bold text-center mb-4 text-black">
                            Konfirmasi Top Up
                        </h1>
                        <div className="text-center mb-6">
                            <p className="text-gray-600 mb-2">Anda akan melakukan top up dengan detail:</p>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Nominal:</span>
                                    <span className="font-semibold text-black">Rp {selectedAmount?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Metode:</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5">
                                            {selected === "OVO" && <PaymentIcons.OVO />}
                                            {selected === "QRIS" && <PaymentIcons.QRIS />}
                                            {selected === "BCA" && <PaymentIcons.BCA />}
                                            {selected === "GoPay" && <PaymentIcons.GoPay />}
                                        </div>
                                        <span className="font-semibold text-black">{selected}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelConfirmation}
                                className="flex-1 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors"
                                disabled={isProcessing}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmTopUp}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                        <span>Memproses...</span>
                                    </div>
                                ) : (
                                    "Konfirmasi"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Screen */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                    <div className="text-center">
                        <div className="mb-6">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="bi bi-check-lg text-4xl text-green-600"></i>
                            </div>
                            <h1 className="text-2xl font-bold text-black mb-2">Top Up Berhasil!</h1>
                            <p className="text-gray-600 mb-4">
                                Saldo Anda telah berhasil ditambahkan sebesar
                            </p>
                            <p className="text-3xl font-bold text-green-600 mb-4">
                                Rp {selectedAmount?.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                                Anda akan diarahkan ke dashboard...
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="animate-spin h-6 w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}