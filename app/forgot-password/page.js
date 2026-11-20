"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../lib/api";
import AuthShell from "../components/AuthShell";

const TITLES = {
  1: ["Forgot Password?", "Enter your email and we'll send you a reset code"],
  2: ["Check Your Email", "Enter the 6-digit code we sent you"],
  3: ["New Password", "Choose a strong password for your account"],
};

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (step === 1) {
        await api.post("/auth/forgotPasswords", { email });
        setStep(2);
      } else if (step === 2) {
        await api.post("/auth/verifyResetCode", { resetCode: code });
        setStep(3);
      } else {
        await api.put("/auth/resetPassword", { email, newPassword });
        router.push("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const [title, subtitle] = TITLES[step];

  return (
    <AuthShell title={title} subtitle={subtitle}>
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              n <= step ? "bg-brand-500" : "bg-line"
            }`}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {step === 1 && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        )}
        {step === 2 && (
          <input
            placeholder="Reset code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="input text-center tracking-[0.4em] text-lg"
            required
          />
        )}
        {step === 3 && (
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
            required
          />
        )}

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button disabled={loading} className="btn-primary mt-2">
          {loading
            ? "Please wait..."
            : step === 1
            ? "Send Code"
            : step === 2
            ? "Verify Code"
            : "Reset Password"}
        </button>
      </form>

      <p className="mt-5 text-sm text-muted text-center">
        Remembered it?{" "}
        <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">
          Back to Sign In
        </Link>
      </p>
    </AuthShell>
  );
}
