"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import SearchModal from "./SearchModal";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/community", label: "Community", badge: "New" },
];

function decodeName(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(payload)))).name || "";
  } catch {
    return "";
  }
}
function Roll({ children }) {
  return (
    <span className="relative inline-block h-[1.25em] overflow-hidden align-middle leading-[1.25em]">
      <span className="block transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
      <span className="absolute left-0 top-full block text-brand-300 transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
    </span>
  );
}
function HeartIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[22px] w-[22px]"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[22px] w-[22px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
    </svg>
  );
}

function Badge({ n }) {
  if (!n) return null;
  return (
    <span className="heart-pop absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
      {n}
    </span>
  );
}

const iconBtn =
  "relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-brand-600/15 hover:text-brand-300";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { token, logout } = useAuth();
  const { count: cartCount } = useCart();
  const { items: saved } = useWishlist();

  const [menu, setMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const name = useMemo(() => (token ? decodeName(token) : ""), [token]);
  const initial = (name || "U").charAt(0).toUpperCase();

  useEffect(() => {
    if (!menu) return;
    const close = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenu(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menu]);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-2 z-50 px-3 pt-2">
      <nav className="glass mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 rounded-full pl-4 pr-2">
        <Link href="/" className="flex shrink-0 items-center">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = isActive(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`group relative block rounded-full px-4 py-2 text-sm transition-colors hover:bg-brand-600/10 ${
                    active ? "bg-brand-600/20 text-brand-300" : "text-muted"
                  }`}
                >
                  <Roll>{l.label}</Roll>
                  {l.badge && (
                    <span className="ml-1.5 animate-pulse rounded-full bg-brand-600 px-1.5 py-0.5 align-middle text-[10px] text-white">
                      {l.badge}
                    </span>
                  )}
                  <span
                    className={`absolute inset-x-4 bottom-0.5 h-0.5 origin-left rounded-full bg-gradient-to-r from-brand-300 to-brand-600 transition-transform duration-300 ${
                      active
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-0.5 text-muted">
          <SearchModal />
          <ThemeToggle />

          <Link
            href="/wishlist"
            title="Saved"
            aria-label="Saved"
            className={`${iconBtn} ${pathname === "/wishlist" || saved?.length ? "text-brand-400" : ""}`}
          >
            <span key={saved?.length ?? 0} className="heart-pop">
              <HeartIcon filled={!!saved?.length} />
            </span>
            <Badge n={saved?.length} />
          </Link>

          <Link
            href="/cart"
            title="Cart"
            aria-label="Cart"
            className={`${iconBtn} ${pathname === "/cart" ? "text-brand-400" : ""}`}
          >
            <CartIcon />
            <Badge n={cartCount} />
          </Link>

          {token ? (
            <div ref={menuRef} className="relative ml-1">
              <button
                onClick={() => setMenu((v) => !v)}
                aria-label="Account"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-800 text-sm font-bold text-white transition-transform hover:scale-105"
              >
                {initial}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[var(--color-ink)] bg-emerald-400" />
              </button>

              {menu && (
                <div className="glass page-enter absolute right-0 top-12 w-56 rounded-2xl p-2 text-sm text-fg">
                  <p className="truncate px-3 py-2 font-semibold">
                    {name || "My account"}
                  </p>
                  <div className="my-1 h-px bg-line" />
                  {[
                    ["/profile", "Profile"],
                    ["/orders", "My Orders"],
                    ["/addresses", "Addresses"],
                    ["/wishlist", "Saved"],
                    ["/change-password", "Change password"],
                  ].map(([href, label]) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMenu(false)}
                      className="block rounded-xl px-3 py-2 transition-colors hover:bg-brand-600/15 hover:text-brand-300"
                    >
                      {label}
                    </Link>
                  ))}
                  <div className="my-1 h-px bg-line" />
                  <button
                    onClick={() => {
                      setMenu(false);
                      logout();
                      router.push("/login");
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left text-red-400 transition-colors hover:bg-red-500/10"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-primary ml-1 w-auto! px-5 py-2 text-sm"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className={`${iconBtn} lg:hidden`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="glass page-enter mx-auto mt-2 max-w-6xl rounded-3xl p-3 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 font-medium transition-colors ${
                isActive(l.href)
                  ? "bg-brand-600/20 text-brand-300"
                  : "hover:bg-brand-600/10"
              }`}
            >
              {l.label}
              {l.badge && (
                <span className="rounded-full bg-brand-600 px-2 py-px text-[10px] font-bold uppercase text-white">
                  {l.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
