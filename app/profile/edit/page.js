"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

function getName(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(payload)))).name || "";
  } catch {
    return "";
  }
}

const EMPTY = { name: "", email: "", phone: "" };

export default function EditProfilePage() {
  const { token } = useAuth();
  const currentName = useMemo(() => (token ? getName(token) : ""), [token]);

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e = {};
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();

    if (!name && !email && !phone)
      e.form = "Fill in at least one field to update.";
    if (name && name.length < 3) e.name = "Name must be at least 3 characters.";
    if (email && !/^\S+@\S+\.\S+$/.test(email))
      e.email = "Enter a valid email address.";
    if (phone && !/^01[0125][0-9]{8}$/.test(phone))
      e.phone = "Enter a valid Egyptian number (01XXXXXXXXX).";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setApiError("");
    setSuccess("");
    if (!validate()) return;

    const payload = {};
    if (form.name.trim()) payload.name = form.name.trim();
    if (form.email.trim()) payload.email = form.email.trim();
    if (form.phone.trim()) payload.phone = form.phone.trim();

    setLoading(true);
    try {
      await api.put("/users/updateMe", payload);
      setSuccess("Your profile was updated successfully.");
      setForm(EMPTY);
    } catch (err) {
      setApiError(
        err.response?.data?.errors?.msg ||
          err.response?.data?.message ||
          "Couldn't update your profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="float mb-6 text-6xl">🔒</div>
        <h1 className="gradient-text text-3xl font-bold">
          Sign in to edit your profile
        </h1>
        <Link href="/login" className="btn-primary mt-8 w-auto! px-8 py-3">
          Sign In
        </Link>
      </section>
    );
  }

  const fields = [
    {
      key: "name",
      label: "Full name",
      type: "text",
      placeholder: currentName || "Your name",
    },
    {
      key: "email",
      label: "Email",
      type: "email",
      placeholder: "Leave empty to keep your current email",
    },
    { key: "phone", label: "Phone", type: "tel", placeholder: "01XXXXXXXXX" },
  ];

  return (
    <section className="mx-auto max-w-2xl px-4 py-10">
      <Link
        href="/profile"
        className="text-sm text-muted transition-colors hover:text-brand-400"
      >
        ← Back to profile
      </Link>

      <div className="glass spin-border relative mt-4 overflow-hidden rounded-3xl p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-600/30 blur-3xl" />

        <div className="relative mb-8 flex items-center gap-5">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-800 text-3xl font-extrabold text-white shadow-[0_0_40px_-5px_var(--color-brand-500)]">
            {(currentName || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="chip mb-2 w-fit">
              <span className="chip-dot" /> Account
            </p>
            <h1 className="text-3xl font-bold">
              Edit <span className="gradient-text">profile</span>
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative space-y-5">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="mb-2 block text-sm font-medium text-muted">
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={set(f.key)}
                placeholder={f.placeholder}
                className="input"
              />
              {errors[f.key] && (
                <p className="mt-1.5 text-xs text-red-400">{errors[f.key]}</p>
              )}
            </div>
          ))}

          {errors.form && <p className="text-sm text-red-400">{errors.form}</p>}

          {apiError && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {apiError}
            </p>
          )}
          {success && (
            <p className="page-enter rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
              ✓ {success} Your name in the menu updates the next time you sign
              in.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </section>
  );
}
