import Link from "next/link";
import Reveal from "./Reveal";
import Marquee from "./Marquee";
import { BRAND } from "../lib/brand";

const chips = [
  "🚚 Free shipping over 500 EGP",
  "↩ 14-day easy returns",
  "🔒 100% secure checkout",
  "💬 24/7 support",
  "✦ New arrivals daily",
  "💳 Cash or online payment",
  "⚡ Fast delivery",
];

function BigWord() {
  return (
    <span className="flex items-center gap-8 pr-8 text-6xl md:text-8xl font-extrabold leading-tight whitespace-nowrap">
      <span className="outline-text">{BRAND.name}</span>
      <span className="spin-slow text-brand-400 text-4xl">✦</span>
      <span className="gradient-text">{BRAND.tagline}</span>
      <span className="spin-slow text-brand-400 text-4xl">✦</span>
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line">
      <div className="py-8 border-b border-line">
        <Marquee speed={0.7}>
          {[0, 1, 2].map((n) => <BigWord key={n} />)}
        </Marquee>
      </div>

      <div className="py-5 border-b border-line">
        <Marquee speed={0.5} reverse>
          {[0, 1, 2].flatMap((n) =>
            chips.map((t) => (
              <span key={`${n}-${t}`} className="chip">
                <span className="chip-dot" />
                {t}
              </span>
            ))
          )}
        </Marquee>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-14 pb-6 grid gap-10 md:grid-cols-4">
        <Reveal className="md:col-span-2">
          <p className="text-2xl font-extrabold gradient-text">{BRAND.name}</p>
          <p className="text-muted mt-3 max-w-sm">
            {BRAND.tagline}. Quality products from the best brands, delivered fast with secure payment.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <p className="font-semibold text-brand-200 mb-4">Shop</p>
          <ul className="space-y-2.5 text-sm text-muted">
            {[["/products", "All Products"], ["/categories", "Categories"], ["/brands", "Brands"], ["/community", "Community"]].map(([h, l]) => (
              <li key={h}><Link href={h} className="hover:text-white hover:pl-1 transition-all">{l}</Link></li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={200}>
          <p className="font-semibold text-brand-200 mb-4">Account</p>
          <ul className="space-y-2.5 text-sm text-muted">
            {[["/login", "Sign In"], ["/register", "Create Account"], ["/wishlist", "Saved"], ["/cart", "Cart"]].map(([h, l]) => (
              <li key={h}><Link href={h} className="hover:text-white hover:pl-1 transition-all">{l}</Link></li>
            ))}
          </ul>
        </Reveal>
      </div>

      <p className="relative z-10 text-center text-muted text-xs py-6 border-t border-line">
        © 2026 {BRAND.name}. All rights reserved.
      </p>
    </footer>
  );
}
