import { ITransaction } from "@/types/transaction.md"

export default function TransactionHistoryItem({
  transaction,
}: {
  transaction: ITransaction;
}) {
  return (
    <div className="transaction-history-item flex-shrink-0">
      <div className="bg-gray-50 border border-gray-200 shadow-md p-3 sm:p-4 w-64 sm:w-72 h-40 sm:h-44 rounded-lg flex flex-col justify-between">
        <div className="flex-1">
          <h1 className="text-base sm:text-lg text-gray-800 mb-2 font-semibold leading-tight">
            {transaction.transaction_purpose || "Transaksi"}
          </h1>
          <p className="text-gray-600 font-bold text-lg sm:text-xl mb-1">
            {transaction.amount >= 0 ? '+' : ''}Rp{Math.abs(transaction.amount).toLocaleString()}
          </p>
          <p className="text-gray-500 text-xs sm:text-sm mb-2 leading-tight">
            {new Date(transaction.transaction_date).toLocaleString("id-ID", {
              weekday: "short",
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}
          </p>
        </div>
        
        <div className="border-t border-gray-300 pt-2">
          <p className="text-gray-600 text-xs sm:text-sm font-medium truncate">
            Metode: {transaction.payment_method}
          </p>
          <p className={`text-xs sm:text-sm font-semibold truncate ${
            transaction.transaction_status === "Berhasil" 
              ? "text-green-600" 
              : transaction.transaction_status === "Gagal" 
                ? "text-red-600" 
                : "text-yellow-600"
          }`}>
            Status: {transaction.transaction_status}
          </p>
        </div>
      </div>
    </div>
  );
}
