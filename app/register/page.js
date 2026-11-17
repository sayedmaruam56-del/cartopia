"use client";
import AuthShell from "../components/AuthShell";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "../lib/api";
import { BRAND } from "../lib/brand";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    phone: "",
  });
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
      await api.post("/auth/signup", form);
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }
return (
  <AuthShell title="Create Account" subtitle={`Join ${BRAND.name} and start shopping`}>
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input name="name" placeholder="Full name" onChange={handleChange} className="input" required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} className="input" required />
      <input name="phone" placeholder="Phone" onChange={handleChange} className="input" required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} className="input" required />
      <input name="rePassword" type="password" placeholder="Confirm password" onChange={handleChange} className="input" required />

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          {error}
        </p>
        
      )}

      <button disabled={loading} className="btn-primary mt-2">
        {loading ? "Creating..." : "Sign Up"}
      </button>
    </form>

    <p className="mt-5 text-sm text-muted text-center">
      Already have an account?{" "}
      <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">
        Sign In
      </Link>
    </p>
    </AuthShell>
    


);}