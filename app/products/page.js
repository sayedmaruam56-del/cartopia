"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";
import Dropdown from "../components/Dropdown";

const SORTS = [
  { value: "", label: "Featured" },
  { value: "price", label: "Price: Low to High" },
  { value: "-price", label: "Price: High to Low" },
  { value: "-ratingsAverage", label: "Top Rated" },
];

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
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

function Filters({
  category,
  brand,
  min,
  max,
  categories,
  brands,
  update,
  clear,
}) {
  const [draft, setDraft] = useState({ min, max });

  function applyPrice() {
    update({ min: draft.min, max: draft.max });
  }

  return (
    <aside className="card h-fit space-y-7 p-5 lg:sticky lg:top-24">
      <div>
        <h3 className="mb-3 font-bold text-brand-200">Price (EGP)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={draft.min}
            onChange={(e) => setDraft({ ...draft, min: e.target.value })}
            className="input h-11! px-3!"
          />
          <span className="text-muted">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={draft.max}
            onChange={(e) => setDraft({ ...draft, max: e.target.value })}
            className="input h-11! px-3!"
          />
        </div>
        <button onClick={applyPrice} className="btn-primary mt-3 py-2.5">
          Apply price
        </button>
      </div>

      <div>
        <h3 className="mb-3 font-bold text-brand-200">Category</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() =>
                update({ category: category === c._id ? "" : c._id })
              }
              className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                category === c._id
                  ? "border-brand-500 bg-brand-500/20 text-brand-300"
                  : "border-line text-muted hover:border-brand-500"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-bold text-brand-200">Brand</h3>
        <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto pr-1">
          {brands.map((b) => (
            <button
              key={b._id}
              onClick={() => update({ brand: brand === b._id ? "" : b._id })}
              className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                brand === b._id
                  ? "border-brand-500 bg-brand-500/20 text-brand-300"
                  : "border-line text-muted hover:border-brand-500"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={clear}
        className="w-full rounded-full border border-line py-2.5 text-sm text-brand-400 transition-colors hover:border-brand-500 hover:text-brand-300"
      >
        Clear all filters
      </button>
    </aside>
  );
}

function ProductsView() {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("category") || "";
  const keyword = params.get("keyword") || "";
  const brand = params.get("brand") || "";
  const sort = params.get("sort") || "";
  const min = params.get("min") || "";
  const max = params.get("max") || "";
  const page = Number(params.get("page") || 1);
  const key = params.toString();

  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState({ categories: [], brands: [] });
  const [result, setResult] = useState({
    key: null,
    items: [],
    pages: 1,
    error: "",
  });

  useEffect(() => {
    let off = false;
    Promise.all([api.get("/categories"), api.get("/brands?limit=100")])
      .then(([c, b]) => {
        if (!off) setLists({ categories: c.data.data, brands: b.data.data });
      })
      .catch(() => {});
    return () => {
      off = true;
    };
  }, []);

  useEffect(() => {
    let off = false;
    const query = { page, limit: 12 };
    if (keyword) query.keyword = keyword;
    if (category) query["category[in]"] = category;
    if (brand) query.brand = brand;
    if (sort) query.sort = sort;
    if (min) query["price[gte]"] = min;
    if (max) query["price[lte]"] = max;

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
  }, [key, page, keyword, category, brand, sort, min, max]);

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

  function clear() {
    router.push("/products");
  }

  const catName = lists.categories.find((c) => c._id === category)?.name;
  const brandName = lists.brands.find((b) => b._id === brand)?.name;
  const hasFilters = keyword || category || brand || min || max;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold gradient-text">
            {keyword ? `Results for “${keyword}”` : "Shop"}
          </h1>
          <p className="mt-1 text-muted">Explore our complete collection</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="glass rounded-full px-5 py-2.5 text-sm font-semibold lg:hidden"
          >
            {open ? "Hide filters" : "Filters"}
          </button>
          <Dropdown
            value={sort}
            onChange={(v) => update({ sort: v })}
            options={SORTS}
            className="w-56"
          />
        </div>
      </div>

      {hasFilters && (
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
              {catName || "Category"} ✕
            </button>
          )}
          {brand && (
            <button onClick={() => update({ brand: "" })} className="chip m-0">
              {brandName || "Brand"} ✕
            </button>
          )}
          {(min || max) && (
            <button
              onClick={() => update({ min: "", max: "" })}
              className="chip m-0"
            >
              Price: {min || 0} – {max || "∞"} ✕
            </button>
          )}
          <button
            onClick={clear}
            className="text-sm text-brand-400 hover:text-brand-300"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className={open ? "block" : "hidden lg:block"}>
          <Filters
            key={`${category}|${brand}|${min}|${max}`}
            category={category}
            brand={brand}
            min={min}
            max={max}
            categories={lists.categories}
            brands={lists.brands}
            update={update}
            clear={clear}
          />
        </div>

        <div>
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
                onClick={clear}
                className="btn-primary mx-auto mt-6 w-auto! px-8"
              >
                Show all products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3">
              {result.items.map((p, i) => (
                <Reveal key={p._id} delay={(i % 3) * 70}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}

          {!loading && result.pages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => update({ page: page - 1 })}
                className="rounded-xl border border-line px-4 py-2 transition-colors hover:border-brand-500 disabled:opacity-40"
              >
                ←
              </button>
              {Array.from({ length: result.pages }, (_, i) => i + 1).map(
                (n) => (
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
                ),
              )}
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
      </div>
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
