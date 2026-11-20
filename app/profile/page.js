"use client";
import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

function decode(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    return {};
  }
}

export default function ProfilePage() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const { count } = useCart();
  const { items: saved } = useWishlist();
  const user = useMemo(() => (token ? decode(token) : {}), [token]);

  if (!token) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="float mb-6 text-6xl">🔒</div>
        <h1 className="gradient-text text-3xl font-bold">
          Sign in to view your profile
        </h1>
        <Link href="/login" className="btn-primary mt-8 px-8 py-3">
          Sign In
        </Link>
      </section>
    );
  }

  const name = user.name || "Friend";
  const actions = [
    {
      icon: "📦",
      title: "My Orders",
      text: "Track and review past orders",
      href: "/orders",
    },
    {
      icon: "💜",
      title: "Saved Items",
      text: `${saved?.length ?? 0} products in your wishlist`,
      href: "/wishlist",
    },
    {
      icon: "🛒",
      title: "My Cart",
      text: `${count ?? 0} items waiting for you`,
      href: "/cart",
    },
    {
      icon: "🔑",
      title: "Change Password",
      text: "Keep your account secure",
      href: "/change-password",
    },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="glass spin-border relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-6">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-800 text-4xl font-extrabold text-white shadow-[0_0_40px_-5px_var(--color-brand-500)]">
              {name.charAt(0).toUpperCase()}
            </div>
            <span className="absolute bottom-1 right-1 h-5 w-5 rounded-full border-2 border-[var(--color-ink)] bg-emerald-400" />
          </div>
          <div className="flex-1">
            <p className="chip mb-2 w-fit">
              <span className="chip-dot" /> Cartopian
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Hi, <span className="gradient-text">{name}</span>
            </h1>
            <p className="mt-1 text-muted">Welcome to your space.</p>
          </div>
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="rounded-full border border-line px-6 py-2.5 text-sm text-muted transition-colors hover:border-red-500 hover:text-red-400"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {actions.map((a) => (
          <Link
            key={a.title}
            href={a.href}
            className="card group flex items-center gap-4 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1.5"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-600/20 text-3xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              {a.icon}
            </span>
            <div className="flex-1">
              <p className="font-semibold">{a.title}</p>
              <p className="text-sm text-muted">{a.text}</p>
            </div>
            <span className="text-brand-400 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
