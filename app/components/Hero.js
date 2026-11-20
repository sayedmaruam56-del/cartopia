"use client";
import { useState } from "react";
import Link from "next/link";
import ProductRows from "./ProductRows";

const SLIDES = [
  {
    tag: "✦ New season drop",
    lines: ["Discover the", "future of", "shopping"],
    text: "Thousands of products, one galaxy. Fast delivery, secure payment and prices that make sense.",
    emoji: "🛍️",
    orbit: ["🎧", "👟", "⌚"],
    primary: { label: "Shop Now", href: "/products" },
    secondary: { label: "Browse Categories", href: "/categories" },
  },
  {
    tag: "⚡ Tech week",
    lines: ["Power up", "your", "everyday"],
    text: "Phones, laptops, audio and smart gear from the brands you trust, all in one orbit.",
    emoji: "💻",
    orbit: ["📱", "🎮", "📷"],
    primary: { label: "Explore Tech", href: "/products" },
    secondary: { label: "View Brands", href: "/brands" },
  },
  {
    tag: "🔥 Up to 50% off",
    lines: ["Style", "without", "limits"],
    text: "Fresh fashion and beauty picks at deals that disappear fast. Save your favorites before they do.",
    emoji: "👗",
    orbit: ["👜", "💄", "🕶️"],
    primary: { label: "View Deals", href: "/products?sort=-price" },
    secondary: { label: "Saved Items", href: "/wishlist" },
  },
];

const POSITIONS = [
  { left: "50%", top: "0%" },
  { left: "93%", top: "75%" },
  { left: "7%", top: "75%" },
];

const STATS = [
  { n: "10k+", l: "Products" },
  { n: "4.9★", l: "Avg. rating" },
  { n: "24/7", l: "Support" },
];

const DURATION = 6000;

export default function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const s = SLIDES[i];
  const next = () => setI((v) => (v + 1) % SLIDES.length);

  return (
    <section
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <ProductRows rows={3} className="opacity-50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--color-ink)] via-[var(--color-ink)]/80 to-[var(--color-ink)]/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--color-ink)] to-transparent" />
      <div
        className="pointer-events-none absolute -right-40 top-0 h-[600px] w-[600px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-brand-600), transparent 65%)",
        }}
      />

      <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-2 lg:py-20">
        <div key={`t-${i}`}>
          <p className="chip blur-in w-fit">{s.tag}</p>

          <h1 className="mt-5 text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            <span className="blur-in block" style={{ animationDelay: "100ms" }}>
              {s.lines[0]}
            </span>
            <span
              className="outline-text blur-in block"
              style={{ animationDelay: "250ms" }}
            >
              {s.lines[1]}
            </span>
            <span
              className="gradient-text blur-in block"
              style={{ animationDelay: "400ms" }}
            >
              {s.lines[2]}
            </span>
          </h1>

          <p
            className="blur-in mt-6 max-w-lg text-lg text-muted"
            style={{ animationDelay: "550ms" }}
          >
            {s.text}
          </p>

          <div
            className="blur-in mt-8 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "700ms" }}
          >
            <Link
              href={s.primary.href}
              className="btn-primary w-auto! px-8 py-3.5 text-base"
            >
              {s.primary.label} →
            </Link>
            <Link
              href={s.secondary.href}
              className="glass rounded-full px-8 py-3.5 text-base font-medium transition-colors hover:text-brand-400"
            >
              {s.secondary.label}
            </Link>
          </div>

          <div
            className="blur-in mt-10 flex gap-8"
            style={{ animationDelay: "850ms" }}
          >
            {STATS.map((x) => (
              <div key={x.l}>
                <p className="gradient-text text-2xl font-extrabold">{x.n}</p>
                <p className="text-sm text-muted">{x.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          key={`v-${i}`}
          className="pop-in relative mx-auto aspect-square w-full max-w-md"
        >
          <div className="absolute inset-0 rounded-full border border-brand-500/25" />
          <div className="absolute inset-[12%] rounded-full border border-dashed border-brand-500/20" />

          <div className="orbit-ring absolute inset-0">
            {s.orbit.map((e, k) => (
              <div
                key={e}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={POSITIONS[k]}
              >
                <div className="orbit-item glass flex h-16 w-16 items-center justify-center rounded-2xl text-3xl">
                  {e}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-[24%] flex items-center justify-center rounded-full bg-gradient-to-br from-brand-500 via-brand-700 to-brand-900 shadow-[0_0_80px_-10px_var(--color-brand-500)]">
            <span className="float text-8xl drop-shadow-2xl">{s.emoji}</span>
          </div>

          <div className="glass float absolute -left-2 top-[14%] rounded-2xl px-4 py-2.5 text-sm font-medium">
            🔥 <span className="text-brand-400">+120</span> orders today
          </div>
          <div
            className="glass float absolute -right-2 bottom-[12%] rounded-2xl px-4 py-2.5 text-sm font-medium"
            style={{ animationDelay: "-3s" }}
          >
            ⭐ 4.9 <span className="text-muted">customer rating</span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-7xl gap-3 px-4 pb-8">
        {SLIDES.map((_, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            aria-label={`Slide ${k + 1}`}
            className="h-1.5 w-16 overflow-hidden rounded-full bg-line sm:w-24"
          >
            {k === i ? (
              <div
                key={`p-${i}`}
                onAnimationEnd={next}
                className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-300"
                style={{
                  animation: `slideProgress ${DURATION}ms linear forwards`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            ) : (
              <div
                className={`h-full rounded-full bg-brand-600/50 ${k < i ? "w-full" : "w-0"}`}
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
