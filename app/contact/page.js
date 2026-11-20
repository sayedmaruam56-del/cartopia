"use client";
import { useState } from "react";
import { BRAND } from "../lib/brand";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function submit(e) {
    e.preventDefault();
    const er = {};
    if (form.name.trim().length < 2) er.name = "Please enter your name.";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = "Enter a valid email.";
    if (form.message.trim().length < 10)
      er.message = "Message should be at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length === 0) setSent(true);
  }

  const info = [
    { icon: "📞", label: "Phone", value: BRAND.phone },
    { icon: "✉️", label: "Email", value: BRAND.email },
    { icon: "🕒", label: "Support hours", value: "24/7, every day" },
  ];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-10 text-center">
        <p className="chip mx-auto mb-3 w-fit">
          <span className="chip-dot" /> Contact
        </p>
        <h1 className="text-4xl font-bold sm:text-5xl">
          Let&apos;s <span className="gradient-text">talk</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Questions, ideas or feedback? We reply fast.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          {info.map((x) => (
            <div
              key={x.label}
              className="card flex items-center gap-4 rounded-2xl p-5"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 text-2xl">
                {x.icon}
              </span>
              <div>
                <p className="text-xs text-muted">{x.label}</p>
                <p className="font-semibold">{x.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass spin-border rounded-3xl p-6 sm:p-8">
          {sent ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <div className="pop-in mb-5 text-7xl">🚀</div>
              <h2 className="gradient-text text-2xl font-bold">
                Message sent!
              </h2>
              <p className="mt-2 text-muted">
                Thanks {form.name.split(" ")[0]}, we&apos;ll get back to you
                soon.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", message: "" });
                }}
                className="mt-6 text-sm text-brand-400 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-muted">Name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm text-muted">Email</label>
                  <input
                    className="input"
                    type="email"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="you@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm text-muted">Message</label>
                <textarea
                  className="input min-h-36"
                  value={form.message}
                  onChange={set("message")}
                  placeholder="How can we help?"
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>
              <button type="submit" className="btn-primary w-full py-3.5">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
