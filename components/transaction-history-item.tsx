import { ITransaction } from "@/types/transaction.md"
export default function TransactionHistoryItem({
  transaction,
}: {
  transaction: ITransaction;
}) {
  return (
    <div className="transaction-history-item">
      <div className="bg-gray-50 border-1 border-gray-50 shadow-md p-2 sm:p-4 min-w-[12rem] sm:min-w-[16rem] rounded-lg flex flex-col gap-2 sm:gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg text-gray-800 mb-2 sm:mb-4">
              {transaction.transaction_purpose}
            </h1>
            <p className="text-gray-600 font-bold text-lg">Rp.{transaction.amount}</p>
            <p className="text-gray-600 font-bold text-lg">
              {new Date(transaction.transaction_date).toLocaleString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
            <p className="text-gray-600 font-bold text-lg">Metode Pembayaran {transaction.payment_method}</p>
            <p className="text-gray-600 font-bold text-lg">Transaksi {transaction.transaction_status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
