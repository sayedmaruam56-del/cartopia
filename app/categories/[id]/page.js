"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "../../lib/api";
import ProductCard from "../../components/ProductCard";
import Reveal from "../../components/Reveal";

function CategoryView({ id }) {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    api
      .get(`/categories/${id}`)
      .then((res) => alive && setCategory(res.data.data))
      .catch(() => alive && setError("Category not found."));
    api
      .get("/products", { params: { "category[in]": id, limit: 40 } })
      .then((res) => alive && setProducts(res.data.data))
      .catch(() => alive && setProducts([]));
    return () => {
      alive = false;
    };
  }, [id]);

  if (error) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="mb-6 text-6xl">🛰️</div>
        <h1 className="gradient-text text-3xl font-bold">{error}</h1>
        <Link href="/categories" className="btn-primary mt-8 w-auto! px-8 py-3">
          All Categories
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-brand-400">
          Home
        </Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-brand-400">
          Categories
        </Link>
        <span>/</span>
        <span className="text-brand-400">{category?.name ?? "..."}</span>
      </nav>

      <div className="glass spin-border mb-10 flex items-center gap-6 rounded-3xl p-6 sm:p-8">
        {category ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-32">
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="128px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="skeleton h-24 w-24 rounded-2xl sm:h-32 sm:w-32" />
        )}
        <div>
          <p className="chip mb-2 w-fit">
            <span className="chip-dot" /> Category
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            <span className="gradient-text">
              {category?.name ?? "Loading..."}
            </span>
          </h1>
          {products && (
            <p className="mt-2 text-muted">{products.length} products</p>
          )}
        </div>
      </div>

      {!products ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-16 text-center">
          <div className="mb-4 text-6xl">🪐</div>
          <p className="text-muted">No products in this category yet.</p>
          <Link
            href="/products"
            className="btn-primary mt-6 inline-block px-8 py-3"
          >
            Browse all products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((p) => (
            <Reveal key={p._id}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}

export default function CategoryDetailsPage() {
  const { id } = useParams();
  return <CategoryView key={id} id={id} />;
}
