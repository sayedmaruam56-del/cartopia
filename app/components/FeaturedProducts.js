"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

export default function FeaturedProducts() {
  const [products, setProducts] = useState(null);

  useEffect(() => {
    let alive = true;
    api
      .get("/products", { params: { sort: "-ratingsAverage", limit: 8 } })
      .then((res) => alive && setProducts(res.data.data))
      .catch(() => alive && setProducts([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="chip mb-3 w-fit">
            <span className="chip-dot" /> Top rated
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Featured <span className="gradient-text">products</span>
          </h2>
        </div>
        <Link
          href="/products"
          className="text-sm text-brand-400 hover:underline"
        >
          Shop everything →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {!products
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[3/4] rounded-2xl" />
            ))
          : products.map((p) => (
              <Reveal key={p._id}>
                <ProductCard product={p} />
              </Reveal>
            ))}
      </div>
    </section>
  );
}
