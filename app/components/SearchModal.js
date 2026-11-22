"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import api from "../lib/api";

const SUGGESTIONS = ["Shirt", "Woman", "Watch", "Shawl", "Shoes"];

function SearchIcon({ className = "h-[22px] w-[22px]" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
      <path d="M8 9.5a3 3 0 0 1 2.5-2.2" strokeWidth="1.5" opacity="0.7" />
    </svg>
  );
}

function Highlight({ text, term }) {
  const t = term.trim();
  if (!t) return text;
  const i = text.toLowerCase().indexOf(t.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-brand-500/30 px-0.5 text-brand-200">
        {text.slice(i, i + t.length)}
      </mark>
      {text.slice(i + t.length)}
    </>
  );
}

export default function SearchModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [catalog, setCatalog] = useState(null);
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);

  const term = q.trim();
  const ready = term.length >= 1;
  const loading = ready && !catalog;

  const items = useMemo(() => {
    if (!ready || !catalog) return [];
    const lower = term.toLowerCase();
    const words = lower.split(/\s+/).filter(Boolean);

    const score = (p) => {
      const title = p.title.toLowerCase();
      if (title.startsWith(lower)) return 0;
      if (words.every((w) => title.split(/\s+/).some((t) => t.startsWith(w))))
        return 1;
      if (words.every((w) => title.includes(w))) return 2;
      return 3;
    };

    const seen = new Set();
    return catalog
      .filter((p) => {
        const hay =
          `${p.title} ${p.category?.name ?? ""} ${p.brand?.name ?? ""}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      })
      .map((p) => ({ p, s: score(p) }))
      .sort((a, b) => a.s - b.s)
      .map((x) => x.p)
      .filter((p) => {
        const key = p.title.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, 6);
  }, [catalog, term, ready]);

  useEffect(() => {
    const onKey = (e) => {
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement?.tagName,
      );
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open || catalog) return;
    let alive = true;
    api
      .get("/products", { params: { limit: 100 } })
      .then((res) => alive && setCatalog(res.data.data))
      .catch(() => alive && setCatalog([]));
    return () => {
      alive = false;
    };
  }, [open, catalog]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  function close() {
    setOpen(false);
    setQ("");
    setIndex(0);
  }

  function go(path) {
    router.push(path);
    close();
  }

  function onInputKey(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (items[index]) go(`/products/${items[index]._id}`);
      else if (ready) go(`/products?keyword=${encodeURIComponent(term)}`);
    }
  }

  const modal = (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div className="glass spin-border page-enter w-full max-w-xl overflow-hidden rounded-3xl bg-surface/95">
        <div className="flex items-center gap-3 border-b border-line px-5">
          <span className="text-brand-400">
            <SearchIcon />
          </span>
          <input
            ref={inputRef}
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Search products..."
            className="h-16 flex-1 bg-transparent text-lg outline-none placeholder:text-muted"
          />
          <kbd className="hidden rounded-lg border border-line px-2 py-1 text-xs text-muted sm:block">
            Esc
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto p-3">
          {!ready && (
            <div className="p-3">
              <p className="mb-3 text-xs uppercase tracking-wider text-muted">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQ(s);
                      inputRef.current?.focus();
                    }}
                    className="chip transition-colors hover:text-brand-300"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {loading &&
            [1, 2, 3].map((n) => (
              <div key={n} className="skeleton m-1 h-16 rounded-2xl" />
            ))}

          {ready && !loading && items.length === 0 && (
            <div className="py-10 text-center">
              <div className="mb-2 text-4xl">🔭</div>
              <p className="font-semibold">
                No results for &ldquo;{term}&rdquo;
              </p>
              <p className="mt-1 text-sm text-muted">Try a different word.</p>
            </div>
          )}

          {items.map((p, i) => (
            <button
              key={p._id}
              onMouseEnter={() => setIndex(i)}
              onClick={() => go(`/products/${p._id}`)}
              className={`flex w-full items-center gap-4 rounded-2xl p-2.5 text-left transition-colors ${
                i === index ? "bg-brand-600/20" : ""
              }`}
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                <Image
                  src={p.imageCover}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 font-medium">
                  <Highlight text={p.title} term={term} />
                </p>
                <p className="text-xs text-muted">{p.category?.name}</p>
              </div>
              <p className="shrink-0 text-sm font-bold text-brand-300">
                {p.priceAfterDiscount ?? p.price} EGP
              </p>
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-4 border-t border-line px-5 py-3 text-xs text-muted sm:flex">
          <span>↑↓ navigate</span>
          <span>Enter open</span>
          <span>Esc close</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Search (Ctrl + K)"
        aria-label="Search"
        className="group relative mr-1 flex h-10 items-center gap-2 rounded-full border border-line bg-brand-600/10 px-3 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/60 hover:bg-brand-600/20 hover:text-brand-300 hover:shadow-[0_8px_24px_-8px_var(--color-brand-500)] xl:px-4"
      >
        <SearchIcon className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
        <span className="hidden text-sm xl:block">Search</span>
      </button>
      {open && createPortal(modal, document.body)}
    </>
  );
}
