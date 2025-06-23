"use client";
import supabase from "@/lib/db";

export async function getTransactionHistory(userId: number) {
    if (!userId || isNaN(userId)) {
        throw new Error("Invalid user ID");
    }

    const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    const { data: transactions, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId);

    if (userError) {
        console.error("Error fetching user details:", userError);
        throw userError;
    }

    if (transactionError) {
        console.error("Error fetching transaction history:", transactionError);
        throw transactionError;
    }

    return {
        user: user || null,
        transactions: transactions || [],
    };
}

export async function getTransactionById(transactionId: number) {
    if (!transactionId || isNaN(transactionId)) {
        throw new Error("Invalid transaction ID");
    }

    const { data: transaction, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", transactionId)
        .single();

    if (error) {
        console.error("Error fetching transaction details:", error);
        throw error;
    }

    return transaction || null;
}

export async function TopUpSaldo(userId: number, amount: number, type: string) {
    if (!userId || isNaN(userId)) {
        throw new Error("Invalid user ID");
    }

    const { data, error } = await supabase
        .from("transactions")
        .insert({
            user_id: userId,
            amount: amount,
            transaction_date: new Date().toISOString(),
            transaction_status: "Berhasil",
            payment_method: type,
        })
        .select("*")
        .single();
        

    if (error) {
        console.error("Error creating transaction:", error);
        throw error;
    }
    
    const { data:userSaldo} = await supabase
        .from("users")
        .select("saldo")
        .eq("id", userId)
        .single();  

    // Update user's balance
    await supabase
        .from("users")
        .update({ saldo: userSaldo?.saldo + amount })
        .eq("id", userId)
        .single();
        
    return data || null;
}

export async function WithdrawSaldo(userId: number, amount: number) {
    if (!userId || isNaN(userId)) {
        throw new Error("Invalid user ID");
    }

    const { data, error } = await supabase
        .from("transactions")
        .insert({
            user_id: userId,
            amount: -amount,
            transaction_date: new Date().toISOString(),
            transaction_status: "Berhasil",
            payment_method: "Tarik Saldo",
        })
        .select("*")
        .single();

    if (error) {
        console.error("Error creating withdrawal transaction:", error);
        throw error;
    }

    const { data:userSaldo} = await supabase
        .from("users")
        .select("saldo")
        .eq("id", userId)
        .single();  

    // Update user's balance
    await supabase
        .from("users")
        .update({ saldo: userSaldo?.saldo - amount })
        .eq("id", userId)
        .single();

    return data || null;
}

export async function BuyMentoringSession(userId: number, amount: number) {
    if (!userId || isNaN(userId)) {
        throw new Error("Invalid user ID");
    }

    const { data:userSaldo} = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();  

    if (userSaldo?.saldo < amount) {
        alert("Saldo tidak cukup untuk membeli sesi mentoring.");
        return;
    }

    const { data, error } = await supabase
        .from("transactions")
        .insert({
            user_id: userId,
            amount: -amount,
            transaction_date: new Date().toISOString(),
            transaction_status: "Berhasil",
            transaction_purpose: "Pembelian Sesi Mentoring",
            payment_method: "Dompetku",
        })
        .select("*")
        .single();

    if (error) {
        console.error("Error creating mentoring session transaction:", error);
        throw error;
    }

    // Update user's balance and saldo_ditahan in a single update call
    await supabase
        .from("users")
        .update({ 
            saldo: userSaldo?.saldo - amount,
            saldo_ditahan: userSaldo?.saldo_ditahan + amount
        })
        .eq("id", userId)
        .single();
        
    return data || null;
}