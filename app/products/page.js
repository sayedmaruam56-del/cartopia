"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";

const CATS = {
  "6439d58a0049ad0b52b9003f": "Electronics",
  "6439d5b90049ad0b52b90048": "Women's Fashion",
  "6439d2d167d9aa4ca970649f": "Men's Fashion",
  "6439d40367d9aa4ca97064a8": "Beauty & Health",
};

const SORTS = [
  { value: "", label: "Featured" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-ratingsAverage", label: "Top Rated" },
];

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton aspect-square" />
          <div className="space-y-3 p-4">
            <div className="skeleton h-3 w-1/3 rounded" />
            <div className="skeleton h-4 w-4/5 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsView() {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category") || "";
  const keyword = params.get("keyword") || "";
  const brand = params.get("brand") || "";
  const sort = params.get("sort") || "";
  const page = Number(params.get("page") || 1);
  const key = params.toString();

  const [result, setResult] = useState({
    key: null,
    items: [],
    pages: 1,
    error: "",
  });

  useEffect(() => {
    let off = false;
    const query = { page, limit: 12 };
    if (keyword) query.keyword = keyword;
    if (category) query["category[in]"] = category;
    if (brand) query.brand = brand;
    if (sort) query.sort = sort;

    api
      .get("/products", { params: query })
      .then((res) => {
        if (!off)
          setResult({
            key,
            items: res.data.data,
            pages: res.data.metadata?.numberOfPages || 1,
            error: "",
          });
      })
      .catch((err) => {
        if (!off)
          setResult({
            key,
            items: [],
            pages: 1,
            error: err.response?.data?.message || "Could not load products",
          });
      });

    return () => {
      off = true;
    };
  }, [key, page, keyword, category, brand, sort]);

  const loading = result.key !== key;

  function update(changes) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    if (!("page" in changes)) sp.delete("page");
    router.push(`/products${sp.toString() ? `?${sp}` : ""}`);
    if ("page" in changes) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold gradient-text">
            {keyword ? `Results for “${keyword}”` : "Shop"}
          </h1>
          <p className="mt-1 text-muted">Explore our complete collection</p>
        </div>
        <select
          value={sort}
          onChange={(e) => update({ sort: e.target.value })}
          className="input w-auto"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value} className="bg-card text-fg">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {(keyword || category || brand) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {keyword && (
            <button
              onClick={() => update({ keyword: "" })}
              className="chip m-0"
            >
              Search: {keyword} ✕
            </button>
          )}
          {category && (
            <button
              onClick={() => update({ category: "" })}
              className="chip m-0"
            >
              {CATS[category] || "Category"} ✕
            </button>
          )}
          {brand && (
            <button onClick={() => update({ brand: "" })} className="chip m-0">
              Brand ✕
            </button>
          )}
          <button
            onClick={() => router.push("/products")}
            className="text-sm text-brand-400 hover:text-brand-300"
          >
            Clear all
          </button>
        </div>
      )}

      {loading ? (
        <SkeletonGrid />
      ) : result.error ? (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
          {result.error}
        </p>
      ) : result.items.length === 0 ? (
        <div className="card py-16 text-center">
          <p className="text-5xl">🔍</p>
          <p className="mt-3 text-xl font-bold text-brand-200">
            No products found
          </p>
          <p className="mt-1 text-muted">
            Try a different search or clear the filters.
          </p>
          <button
            onClick={() => router.push("/products")}
            className="btn-primary mx-auto mt-6 w-auto px-8"
          >
            Show all products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
          {result.items.map((p, i) => (
            <Reveal key={p._id} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}

      {!loading && result.pages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => update({ page: page - 1 })}
            className="rounded-xl border border-line px-4 py-2 transition-colors hover:border-brand-500 disabled:opacity-40"
          >
            ←
          </button>
          {Array.from({ length: result.pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              onClick={() => update({ page: n })}
              className={`h-10 w-10 rounded-xl text-sm font-semibold transition-all ${
                n === page
                  ? "bg-linear-to-br from-brand-500 to-brand-700 on-brand shadow-[0_8px_24px_-8px_rgba(124,58,237,0.8)]"
                  : "border border-line hover:border-brand-500"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            disabled={page >= result.pages}
            onClick={() => update({ page: page + 1 })}
            className="rounded-xl border border-line px-4 py-2 transition-colors hover:border-brand-500 disabled:opacity-40"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-10">
          <SkeletonGrid />
        </div>
      }
    >
      <ProductsView />
    </Suspense>
  );
}
