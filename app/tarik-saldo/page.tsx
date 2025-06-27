'use client'
import { useState } from "react";
import * as transaction from "@/lib/transaction";
import { useUser } from "@/context/UserContext";

// Bank method icons as components
const BankIcons = {
  BCA: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#005BAA" />
      <path d="M7 10C8.10457 10 9 9.10457 9 8C9 6.89543 8.10457 6 7 6C5.89543 6 5 6.89543 5 8C5 9.10457 5.89543 10 7 10Z" fill="#FFFFFF" />
      <path d="M17 10C18.1046 10 19 9.10457 19 8C19 6.89543 18.1046 6 17 6C15.8954 6 15 6.89543 15 8C15 9.10457 15.8954 10 17 10Z" fill="#FFFFFF" />
      <path d="M12 11L9 14H15L12 11Z" fill="#FFFFFF" />
      <rect x="7" y="14" width="10" height="4" rx="1" fill="#FFFFFF" />
    </svg>
  ),
  Mandiri: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#003d82" />
      <path d="M5 8h14v8H5V8z" fill="#FFD700" />
      <path d="M7 10h2v4H7v-4zm3 0h2v4h-2v-4zm3 0h2v4h-2v-4zm3 0h2v4h-2v-4z" fill="#003d82" />
    </svg>
  ),
  BNI: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#FF6600" />
      <path d="M4 6h16v12H4V6z" fill="#FFFFFF" />
      <path d="M6 8v8h12V8H6z" fill="#FF6600" />
      <path d="M8 10h8v4H8v-4z" fill="#FFFFFF" />
    </svg>
  ),
  BRI: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#004080" />
      <path d="M4 6h16v12H4V6z" fill="#FFFFFF" />
      <path d="M6 8v8h12V8H6z" fill="#004080" />
      <path d="M12 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" fill="#FFFFFF" />
    </svg>
  )
};

export default function TarikSaldoPage() {
    const methods = ["BCA", "Mandiri", "BNI", "BRI"];
    const [selected, setSelected] = useState<string | null>(null);
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const amounts = [50000, 100000, 200000];
    const { loggedInUser } = useUser();

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
        setCustomAmount("");
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        setCustomAmount(value);
        setSelectedAmount(value ? parseInt(value) : null);
    };

    const handleWithdrawClick = () => {
        if (!selected || !selectedAmount) {
            alert("Silakan pilih nominal dan metode penarikan terlebih dahulu.");
            return;
        }

        if (selectedAmount < 10000) {
            alert("Minimal penarikan adalah Rp 10.000");
            return;
        }

        if (selectedAmount > (loggedInUser?.saldo || 0)) {
            alert("Saldo tidak mencukupi untuk penarikan ini.");
            return;
        }

        setShowConfirmation(true);
    };

    const handleConfirmWithdraw = async () => {
        setIsProcessing(true);
        try {
            await transaction.TarikSaldo(Number(loggedInUser?.id), selectedAmount!, selected!);
            setShowConfirmation(false);
            setShowSuccess(true);
            
            // Auto redirect after 3 seconds
            setTimeout(() => {
                window.location.href = "/user_dashboard";
            }, 3000);
        } catch (error: unknown) {
            console.error("Error during withdrawal:", error);
            if (error instanceof Error && error.message === "Saldo tidak mencukupi") {
                alert("Saldo tidak mencukupi untuk penarikan ini.");
            } else {
                alert("Terjadi kesalahan saat melakukan penarikan.");
            }
            setIsProcessing(false);
        }
    };

    const handleCancelConfirmation = () => {
        setShowConfirmation(false);
    };

    return (
        <>
            {/* Main Container - Proper spacing for navbar and footer */}
            <div className="min-h-screen bg-sky-100 pt-16 sm:pt-20 pb-16 sm:pb-20">
                <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 flex items-center justify-center min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-10rem)]">
                    <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-xl bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
                        <div className="text-center mb-4 sm:mb-6">
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-black">Tarik Saldo</h1>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-1 sm:mb-2">
                                Saldo tersedia: <span className="font-bold text-green-600">Rp {loggedInUser?.saldo?.toLocaleString()}</span>
                            </p>
                            <p className="text-xs sm:text-sm md:text-base text-gray-600">
                                Silakan pilih nominal dan metode penarikan yang Anda inginkan.
                            </p>
                        </div>
                        
                        <div className="space-y-4 sm:space-y-6">
                            {/* Amount selection section */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                                    Pilih Nominal Penarikan
                                </label>
                                <div className="flex flex-col gap-2 sm:gap-3">
                                    {amounts.map((amount) => (
                                        <button
                                            key={amount}
                                            className={`w-full border rounded-lg p-2 sm:p-3 gap-2 flex items-center justify-start transition text-sm md:text-base
                                                ${selectedAmount === amount && !customAmount
                                                    ? "bg-blue-500 text-white border-blue-500"
                                                    : "bg-gray-200 text-black border-gray-300 hover:bg-blue-100"}
                                            `}
                                            type="button"
                                            onClick={() => handleAmountSelect(amount)}
                                            disabled={amount > (loggedInUser?.saldo || 0)}
                                        >
                                            <i className="bi bi-chevron-right text-xs sm:text-sm"></i>
                                            <span className="font-medium text-left">Rp {amount.toLocaleString()}</span>
                                            {amount > (loggedInUser?.saldo || 0) && (
                                                <span className="text-xs text-red-500 ml-auto">(Saldo tidak cukup)</span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Custom amount input */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                                    Atau Masukkan Nominal Lain (Min. Rp 10.000)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm md:text-base">Rp</span>
                                    <input
                                        type="text"
                                        value={customAmount}
                                        onChange={handleCustomAmountChange}
                                        placeholder="0"
                                        className="w-full pl-8 md:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                                    />
                                </div>
                                {customAmount && parseInt(customAmount) < 10000 && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">Minimal penarikan adalah Rp 10.000</p>
                                )}
                                {customAmount && parseInt(customAmount) > (loggedInUser?.saldo || 0) && (
                                    <p className="text-red-500 text-xs sm:text-sm mt-1">Nominal melebihi saldo yang tersedia</p>
                                )}
                            </div>
                            
                            {/* Bank selection */}
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                                    Pilih Bank Tujuan
                                </label>
                                <div className="flex flex-col gap-2 sm:gap-3">
                                    {methods.map((method) => (
                                        <button
                                            key={method}
                                            className={`w-full border rounded-lg p-2 sm:p-3 flex items-center transition text-sm md:text-base
                                                ${selected === method
                                                    ? "bg-blue-500 text-white border-blue-500"
                                                    : "bg-gray-200 text-black border-gray-300 hover:bg-blue-100"}
                                            `}
                                            type="button"
                                            onClick={() => setSelected(method)}
                                        >
                                            <div className="mr-2 sm:mr-3 flex-shrink-0">
                                                {method === "BCA" && <BankIcons.BCA />}
                                                {method === "Mandiri" && <BankIcons.Mandiri />}
                                                {method === "BNI" && <BankIcons.BNI />}
                                                {method === "BRI" && <BankIcons.BRI />}
                                            </div>
                                            <span className="font-medium">Bank {method}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Submit button */}
                            <button
                                className="w-full bg-blue-500 text-white px-4 py-2 sm:py-3 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm md:text-base font-medium"
                                disabled={!selected || !selectedAmount || selectedAmount < 10000 || selectedAmount > (loggedInUser?.saldo || 0)}
                                onClick={handleWithdrawClick}
                            >
                                Tarik Saldo Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm">
                        <h1 className="text-lg sm:text-xl font-bold text-center mb-3 sm:mb-4 text-black">
                            Konfirmasi Penarikan
                        </h1>
                        <div className="text-center mb-4 sm:mb-6">
                            <p className="text-gray-600 mb-2 text-sm sm:text-base">Anda akan melakukan penarikan dengan detail:</p>
                            <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600 text-sm sm:text-base">Nominal:</span>
                                    <span className="font-semibold text-black text-sm sm:text-base">Rp {selectedAmount?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm sm:text-base">Bank:</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0">
                                            {selected === "BCA" && <BankIcons.BCA />}
                                            {selected === "Mandiri" && <BankIcons.Mandiri />}
                                            {selected === "BNI" && <BankIcons.BNI />}
                                            {selected === "BRI" && <BankIcons.BRI />}
                                        </div>
                                        <span className="font-semibold text-black text-sm sm:text-base">Bank {selected}</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                Saldo setelah penarikan: Rp {((loggedInUser?.saldo || 0) - (selectedAmount || 0)).toLocaleString()}
                            </p>
                        </div>
                        <div className="flex gap-2 sm:gap-3">
                            <button
                                onClick={handleCancelConfirmation}
                                className="flex-1 px-3 sm:px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition-colors text-sm sm:text-base"
                                disabled={isProcessing}
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmWithdraw}
                                className="flex-1 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-sm sm:text-base"
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                                        <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 border-2 border-white rounded-full border-t-transparent"></div>
                                        <span className="text-xs sm:text-sm">Memproses...</span>
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4">
                    <div className="text-center max-w-xs sm:max-w-sm">
                        <div className="mb-4 sm:mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <i className="bi bi-check-lg text-2xl sm:text-4xl text-green-600"></i>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-bold text-black mb-2">Penarikan Berhasil!</h1>
                            <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                                Saldo telah berhasil ditarik sebesar
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-3 sm:mb-4">
                                Rp {selectedAmount?.toLocaleString()}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2">
                                Dana akan diproses ke rekening Bank {selected} Anda
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                                Anda akan diarahkan ke dashboard...
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="animate-spin h-5 w-5 sm:h-6 sm:w-6 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}