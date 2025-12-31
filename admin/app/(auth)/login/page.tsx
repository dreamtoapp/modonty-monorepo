import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "./components/login-form";

export default async function LoginPage() {
  let session;
  try {
    session = await auth();
  } catch (error) {
    console.error("Auth error in login page:", error);
    // Continue to show login form on error
    session = null;
  }

  if (session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
