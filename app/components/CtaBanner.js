"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { BRAND } from "../lib/brand";
import Reveal from "./Reveal";
import ProductRows from "./ProductRows";

export default function CtaBanner() {
  const { token } = useAuth();

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <Reveal>
        <div className="on-brand announce relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20">
          <ProductRows rows={2} tilt={-6} className="opacity-25" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-900/50 via-transparent to-violet-900/60" />

          <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-fuchsia-400/20 blur-3xl" />

          <span className="float absolute left-[8%] top-[18%] hidden text-5xl sm:block">
            🛍️
          </span>
          <span
            className="float absolute right-[9%] top-[22%] hidden text-5xl sm:block"
            style={{ animationDelay: "-2s" }}
          >
            💜
          </span>
          <span
            className="float absolute bottom-[16%] left-[14%] hidden text-4xl sm:block"
            style={{ animationDelay: "-4s" }}
          >
            ✨
          </span>
          <span
            className="float absolute bottom-[18%] right-[15%] hidden text-4xl sm:block"
            style={{ animationDelay: "-1s" }}
          >
            🚀
          </span>

          <div className="relative">
            <h2 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              {token
                ? "Your next favorite thing is waiting"
                : `Join the ${BRAND.name} orbit`}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
              {token
                ? "Fresh arrivals land every day. Go see what's new."
                : "Create a free account to save favorites, track orders and check out in seconds."}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              {token ? (
                <Link
                  href="/products"
                  className="rounded-full bg-white px-8 py-3.5 font-semibold text-violet-700 transition-transform hover:scale-105"
                >
                  Shop Now →
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="rounded-full bg-white px-8 py-3.5 font-semibold text-violet-700 transition-transform hover:scale-105"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/products"
                    className="rounded-full border border-white/50 px-8 py-3.5 font-semibold text-white transition-colors hover:bg-white/15"
                  >
                    Just Browse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
