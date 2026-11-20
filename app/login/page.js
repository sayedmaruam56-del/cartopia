"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/signin", form);
      login(data.token);
      router.push("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to continue shopping">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="input" required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input" required />

        <Link href="/forgot-password" className="text-sm text-brand-400 hover:text-brand-300 self-end">
          Forgot password?
        </Link>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button disabled={loading} className="btn-primary mt-2">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="mt-5 text-sm text-muted text-center">
        New here?{" "}
        <Link href="/register" className="text-brand-400 hover:text-brand-300 font-medium">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
