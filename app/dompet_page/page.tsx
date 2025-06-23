'use client'
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import TransactionHistoryItem from "@/components/transaction-history-item";
import { ITransaction } from "@/types/transaction.md";
import supabase from "@/lib/db";

export default function DompetPage() {
    const { loggedInUser } = useUser();
    const [transactionHistory, setTransactionHistory] = useState<ITransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTransactionHistory() {
            if (!loggedInUser || !loggedInUser.id) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                
                // Skip the table check and directly fetch transactions
                const { data, error } = await supabase
                  .from("transactions")
                  .select("*")
                  .eq("user_id", loggedInUser.id)
                  .order('transaction_date', { ascending: false })
                  .limit(10);
                
                if (error) {
                    console.error("Error fetching transaction history:", error.message, error.details);
                    setLoading(false);
                    return;
                }
                
                setTransactionHistory(data || []);
            } catch (error) {
                console.error("Unexpected error in transaction fetch:", error);
            } finally {
                setLoading(false);
            }
        }
        
        fetchTransactionHistory();
    }, [loggedInUser]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky-100">
        <div className="min-h-[0vh] md:min-h-[6vh]"></div>
        <div className="flex flex-col gap-4 bg-white p-2 sm:p-4 w-[70%] min-h-[35rem] rounded-lg shadow-lg">
            <div className="flex gap-2 sm:gap-4 items-center">
                <i className="text-2xl sm:text-3xl lg:text-4xl text-gray-600 text-center bi bi-wallet2"></i>
                <h1 className="text-black text-xl font-bold">Dompetku</h1>
            </div>
            <div className="bg-gray-50 border-1 border-gray-50 shadow-md p-2 sm:p-4 w-full rounded-lg flex flex-col gap-2 sm:gap-4">
                <div>
                    <h1 className="text-lg text-gray-800 mb-2 sm:mb-4">Saldo Anda</h1>
                    <p className="text-gray-600 font-bold text-lg">Rp. {loggedInUser?.saldo}</p>
                </div>
            </div>
            <div className="bg-gray-50 border-1 border-gray-50 shadow-md p-2 sm:p-4 w-full rounded-lg flex flex-col gap-2 sm:gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-lg text-gray-800 mb-2 sm:mb-4">Saldo Ditahan</h1>
                        <p className="text-gray-600 font-bold text-lg">Rp. {loggedInUser?.saldo_ditahan || 0}</p>
                    </div>
                    <i className="bi bi-arrow-right text-blue-500 text-lg"></i>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-4 h-full items-center justify-center">
                <Link href="/tarik-saldo" className="hover:cursor-pointer hover:bg-blue-600 bg-blue-500 shadow-lg rounded-lg p-2 w-full h-full flex justify-center gap-2 sm:gap-4">
                    <h1 className="text-lg text-center text-white">Tarik Saldo</h1>
                    <i className="text-lg bi bi-arrow-bar-up text-white"></i>
                </Link>
                <Link href="/topup-saldo" className="hover:cursor-pointer hover:bg-blue-600 bg-blue-500 shadow-lg rounded-lg p-2 w-full h-full flex justify-center gap-2 sm:gap-4">
                    <h1 className="text-lg text-center text-white">Isi Saldo</h1>
                    <i className="text-lg bi bi-arrow-bar-up text-white"></i>
                </Link>
            </div>
            <h1 className="text-black text-lg font-bold">Transaksi Terakhir</h1>
            <div className="w-full overflow-x-auto relative">
                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
                        <span className="ml-2 text-gray-500">Memuat transaksi...</span>
                    </div>
                ) : transactionHistory.length > 0 ? (
                    <div className="flex gap-2 sm:gap-4 w-max pb-2 sm:pb-4">
                        {transactionHistory.map((transaction) => (
                            <TransactionHistoryItem key={transaction.id} transaction={transaction} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 py-4">Belum ada transaksi</p>
                )}
            </div>
        </div>
    </div>
  );
}
