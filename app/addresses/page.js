"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

const LABELS = [
  ["Home", "🏠"],
  ["Work", "💼"],
  ["Other", "📍"],
];
const iconFor = (name) => LABELS.find(([l]) => l === name)?.[1] ?? "📍";
const EMPTY = { name: "Home", details: "", phone: "", city: "" };

export default function AddressesPage() {
  const { token } = useAuth();
  const [list, setList] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState(null);

  const load = useCallback(
    () =>
      api
        .get("/addresses")
        .then((res) => setList(res.data.data))
        .catch(() => setList([])),
    [],
  );

  useEffect(() => {
    if (token) load();
  }, [token, load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e = {};
    if (form.details.trim().length < 5)
      e.details = "Please enter the full address.";
    if (!/^01[0125][0-9]{8}$/.test(form.phone.trim()))
      e.phone = "Enter a valid Egyptian number (01XXXXXXXXX).";
    if (form.city.trim().length < 2) e.city = "City is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function add(ev) {
    ev.preventDefault();
    setApiError("");
    if (!validate()) return;
    setBusy(true);
    try {
      await api.post("/addresses", {
        name: form.name,
        details: form.details.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
      });
      setForm(EMPTY);
      await load();
    } catch (err) {
      setApiError(err.response?.data?.message || "Couldn't save the address.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    setRemoving(id);
    try {
      await api.delete(`/addresses/${id}`);
      await load();
    } finally {
      setRemoving(null);
    }
  }

  if (!token) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="float mb-6 text-6xl">🔒</div>
        <h1 className="gradient-text text-3xl font-bold">
          Sign in to manage your addresses
        </h1>
        <Link href="/login" className="btn-primary mt-8 w-auto! px-8 py-3">
          Sign In
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <p className="chip mb-3 w-fit">
          <span className="chip-dot" /> Address book
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          My <span className="gradient-text">addresses</span>
        </h1>
        <p className="mt-2 text-muted">
          Save your places once and check out in a single tap.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          {!list &&
            [1, 2].map((n) => (
              <div key={n} className="skeleton h-32 rounded-3xl" />
            ))}

          {list && list.length === 0 && (
            <div className="card rounded-3xl py-16 text-center">
              <div className="float mb-4 text-6xl">🗺️</div>
              <p className="font-semibold">No saved addresses yet</p>
              <p className="mt-1 text-sm text-muted">
                Add your first address using the form.
              </p>
            </div>
          )}

          {list?.map((a) => (
            <article
              key={a._id}
              className={`card page-enter flex items-start gap-4 rounded-3xl p-5 transition-opacity ${
                removing === a._id ? "opacity-40" : ""
              }`}
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600/20 text-3xl">
                {iconFor(a.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{a.name}</p>
                <p className="mt-1 text-sm text-muted">{a.details}</p>
                <p className="text-sm text-muted">{a.city}</p>
                <p className="mt-1 text-sm">📞 {a.phone}</p>
              </div>
              <button
                onClick={() => remove(a._id)}
                disabled={removing === a._id}
                className="rounded-full border border-line px-4 py-1.5 text-xs text-muted transition-colors hover:border-red-500 hover:text-red-400"
              >
                Delete
              </button>
            </article>
          ))}
        </div>

        <form
          onSubmit={add}
          className="glass spin-border h-fit space-y-5 rounded-3xl p-6 lg:sticky lg:top-28"
        >
          <h2 className="text-xl font-bold">Add new address</h2>

          <div className="flex gap-2">
            {LABELS.map(([label, icon]) => (
              <button
                type="button"
                key={label}
                onClick={() => setForm((f) => ({ ...f, name: label }))}
                className={`flex-1 rounded-2xl border px-3 py-2.5 text-sm transition-all ${
                  form.name === label
                    ? "border-brand-500 bg-brand-600/20 text-brand-300"
                    : "border-line text-muted hover:border-brand-500/50"
                }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-2 block text-sm text-muted">
              Address details
            </label>
            <input
              className="input"
              value={form.details}
              onChange={set("details")}
              placeholder="Street, building, floor, apartment..."
            />
            {errors.details && (
              <p className="mt-1.5 text-xs text-red-400">{errors.details}</p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-muted">Phone</label>
              <input
                className="input"
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="01XXXXXXXXX"
              />
              {errors.phone && (
                <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="mb-2 block text-sm text-muted">City</label>
              <input
                className="input"
                value={form.city}
                onChange={set("city")}
                placeholder="Cairo"
              />
              {errors.city && (
                <p className="mt-1.5 text-xs text-red-400">{errors.city}</p>
              )}
            </div>
          </div>

          {apiError && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {apiError}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="btn-primary w-full py-3 disabled:opacity-60"
          >
            {busy ? "Saving..." : "Save address"}
          </button>
        </form>
      </div>
    </section>
  );
}
