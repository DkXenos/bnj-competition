"use client";
import supabase from "@/lib/db";

export async function loginUser(usernameOrEmail: string, password: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .or(`email.eq.${usernameOrEmail},username.eq.${usernameOrEmail}`)
    .single();

  if (
    error ||
    !user ||
    user.password !== password ||
    (user.email !== usernameOrEmail && user.username !== usernameOrEmail)
  ) {
    return {
      success: false,
      user: null,
      error: "Invalid username/email or password",
    };
  }

  // Save the logged-in user to local storage
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  return { success: true, user };
}
