"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BRAND } from "../lib/brand";

const messages = [
  "🚚 Free shipping on orders over 500 EGP",
  "✨ New arrivals every single day",
  "💳 Pay online or cash on delivery",
  "↩ 14-day hassle-free returns",
];

export default function AnnouncementBar() {
  const { token } = useAuth();
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % messages.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="announce on-brand text-xs sm:text-[13px]">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4">
        <div className="hidden items-center gap-5 opacity-90 md:flex">
          <a
            href={`tel:${BRAND.phone.replace(/[^+\d]/g, "")}`}
            className="hover:underline"
          >
            {BRAND.phone}
          </a>
          <a href={`mailto:${BRAND.email}`} className="hover:underline">
            {BRAND.email}
          </a>
        </div>

        <div className="h-5 flex-1 overflow-hidden text-center font-medium md:flex-none">
          <p key={i} className="msg-in">
            {messages[i]}
          </p>
        </div>

        <div className="hidden items-center gap-4 opacity-90 sm:flex">
          {token ? (
            <span>Welcome back ✦</span>
          ) : (
            <>
              <Link href="/login" className="hover:underline">
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-white/20 px-3 py-0.5 transition-colors hover:bg-white/30"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
