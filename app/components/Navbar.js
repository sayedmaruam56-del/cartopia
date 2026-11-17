"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { BRAND } from "../lib/brand";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/brands", label: "Brands" },
  { href: "/community", label: "Community", badge: "New" },
];

// بنقرأ الاسم من الـ token (JWT)
function getName(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(part)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json).name || "User";
  } catch {
    return "User";
  }
}

// النص بيعمل Roll لما تقفي عليه (اللينك لازم يكون فيه class group)
function Roll({ children }) {
  return (
    <span className="relative inline-block overflow-hidden h-[1.25em] leading-[1.25em] align-middle">
      <span className="block transition-transform duration-300 group-hover:-translate-y-full">{children}</span>
      <span className="absolute left-0 top-full block text-brand-300 transition-transform duration-300 group-hover:-translate-y-full">
        {children}
      </span>
    </span>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-4.35-9.5-8.5C.5 9 2.5 5 6 5c2 0 3.5 1 4 2 .5-1 2-2 4-2 3.5 0 5.5 4 3.5 7.5C19 16.65 12 21 12 21z" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L20 7H6" />
    </svg>
  );
}

export default function Navbar() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  const name = useMemo(() => (token ? getName(token) : ""), [token]);
  const initial = name ? name.trim()[0].toUpperCase() : "U";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    function onClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
    setMenu(false);
    router.push("/login");
  }

  const iconBtn =
    "relative flex items-center gap-2 px-3 py-2.5 rounded-xl text-brand-200 hover:text-white hover:bg-brand-600/20 hover:-translate-y-0.5 transition-all";

  const menuItem =
    "block w-full text-left px-3 py-2.5 rounded-xl text-sm text-brand-200 hover:text-white hover:bg-brand-600/20 transition-colors";

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <nav
        className={`glass spin-border mx-auto rounded-2xl px-5 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "max-w-6xl py-2 shadow-[0_12px_40px_-12px_rgba(124,58,237,0.7)]"
            : "max-w-7xl py-3.5"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid place-items-center w-9 h-9 rounded-xl font-extrabold on-brand bg-linear-to-r from-brand-400 to-brand-700 transition-transform group-hover:rotate-12">
  {BRAND.letter}
</span>
<span className="text-xl font-extrabold gradient-text">{BRAND.name}</span>
        </Link>

        {/* Links */}
        <ul className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`group relative px-4 py-2 rounded-xl text-sm transition-colors hover:bg-brand-600/10 ${
                    active ? "text-white" : "text-brand-200"
                  }`}
                >
                  <Roll>{l.label}</Roll>
                  {l.badge && (
                    <span className="ml-1.5 align-middle text-[10px] px-1.5 py-0.5 rounded-full bg-brand-600 text-white animate-pulse">
                      {l.badge}
                    </span>
                  )}
                  <span
                    className={`absolute left-4 right-4 -bottom-0.5 h-0.5 rounded-full bg-linear-to-r from-brand-300 to-brand-600 origin-left transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-1">
          <ThemeToggle />
          <Link href="/wishlist" className={iconBtn} title="Saved">
            <HeartIcon />
            <span className="text-sm">Saved</span>
          </Link>
          <Link href="/cart" className={iconBtn} title="Cart">
            <CartIcon />
            <span className="text-sm">Cart</span>
          </Link>

          {token ? (
            <div className="relative ml-2" ref={menuRef}>
              <button
                onClick={() => setMenu(!menu)}
                aria-label="Account menu"
                className="relative w-10 h-10 rounded-full grid place-items-center font-bold bg-linear-to-r from-brand-400 to-brand-700 ring-2 ring-brand-500/40 hover:ring-brand-300 hover:shadow-[0_0_22px_rgba(139,92,246,0.8)] transition-all"
              >
                {initial}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-ink" />
              </button>

              <div
                className={`glass spin-border absolute right-0 mt-3 w-60 rounded-2xl p-2 origin-top-right transition-all duration-300 ${
                  menu ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div className="px-3 py-3 border-b border-line mb-1">
                  <p className="text-xs text-muted">Signed in as</p>
                  <p className="font-semibold text-white truncate">{name}</p>
                </div>
                <Link href="/profile/orders" onClick={() => setMenu(false)} className={menuItem}>My Orders</Link>
                <Link href="/wishlist" onClick={() => setMenu(false)} className={menuItem}>Saved Items</Link>
                <Link href="/change-password" onClick={() => setMenu(false)} className={menuItem}>Change Password</Link>
                <button onClick={handleLogout} className={`${menuItem} text-red-300! hover:bg-red-500/10!`}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="btn-primary w-auto! py-2! px-5! text-sm ml-2">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile button */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-brand-200 text-2xl" aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`lg:hidden mx-auto max-w-7xl overflow-hidden transition-all duration-500 ${
          open ? "max-h-128 mt-2 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass rounded-2xl p-4 flex flex-col gap-3 text-brand-200">
          <ThemeToggle className="self-start" />
          {[...links, { href: "/wishlist", label: "Saved" }, { href: "/cart", label: "Cart" }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="hover:text-white">
              {l.label}
            </Link>
          ))}
          {token ? (
            <>
              <Link href="/profile/orders" onClick={() => setOpen(false)} className="hover:text-white">My Orders</Link>
              <Link href="/change-password" onClick={() => setOpen(false)} className="hover:text-white">Change Password</Link>
              <button onClick={handleLogout} className="text-left text-red-300">Logout</button>
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="hover:text-white">Sign In</Link>
          )}
        </div>
      </div>
    </header>
  );
}