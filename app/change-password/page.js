"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";

export default function ChangePassword() {
  const router = useRouter();
  const { token, login } = useAuth();
  const [form, setForm] = useState({
    currentPassword: "",
    password: "",
    rePassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) router.replace("/login");
  }, [token, router]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { data } = await api.put("/users/changeMyPassword", form);
      if (data.token) login(data.token);
      setSuccess("Password changed successfully");
      setForm({ currentPassword: "", password: "", rePassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Change Password" subtitle="Keep your account secure">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="currentPassword"
          type="password"
          placeholder="Current password"
          value={form.currentPassword}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="New password"
          value={form.password}
          onChange={handleChange}
          className="input"
          required
        />
        <input
          name="rePassword"
          type="password"
          placeholder="Confirm new password"
          value={form.rePassword}
          onChange={handleChange}
          className="input"
          required
        />

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        <button disabled={loading} className="btn-primary mt-2">
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </AuthShell>
  );
}
