"use client";
import { useEffect, useState } from "react";
import { BRAND } from "../lib/brand";

export default function Splash() {
  const [phase, setPhase] = useState("show");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("splash") === "1";
      sessionStorage.setItem("splash", "1");
    } catch {}
    const t1 = setTimeout(() => setPhase("leave"), seen ? 0 : 1900);
    const t2 = setTimeout(() => setPhase("gone"), seen ? 0 : 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[var(--color-ink)] transition-opacity duration-700 ${
        phase === "leave" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative h-28 w-28">
        <div className="absolute inset-0 rounded-full border border-brand-500/30" />
        <div className="orbit-ring absolute inset-0">
          <span className="absolute left-1/2 top-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-400 shadow-[0_0_16px_var(--color-brand-400)]" />
        </div>
        <div className="absolute inset-[28%] flex items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-800 text-3xl font-extrabold text-white shadow-[0_0_40px_-4px_var(--color-brand-500)]">
          {BRAND.letter}
        </div>
      </div>

      <h1 className="mt-8 flex text-4xl font-extrabold tracking-wide">
        {BRAND.name.split("").map((ch, i) => (
          <span
            key={i}
            className="blur-in gradient-text"
            style={{ animationDelay: `${300 + i * 80}ms` }}
          >
            {ch}
          </span>
        ))}
      </h1>
      <p
        className="blur-in mt-2 text-sm text-muted"
        style={{ animationDelay: "1000ms" }}
      >
        {BRAND.tagline}
      </p>

      <div className="mt-8 h-1 w-48 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-300"
          style={{ animation: "slideProgress 1.8s ease-in-out forwards" }}
        />
      </div>
    </div>
  );
}
