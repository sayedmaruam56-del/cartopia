"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "../lib/api";
import Reveal from "../components/Reveal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    api
      .get("/categories")
      .then((res) => alive && setCategories(res.data.data))
      .catch(() => alive && setError("Couldn't load categories."));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10 text-center">
        <p className="chip mx-auto mb-3 w-fit">
          <span className="chip-dot" /> Browse
        </p>
        <h1 className="text-4xl font-bold sm:text-5xl">
          Shop by <span className="gradient-text">Category</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Pick a universe and dive in.
        </p>
      </div>

      {error && <p className="text-center text-red-400">{error}</p>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {!categories && !error
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[4/5] rounded-3xl" />
            ))
          : categories?.map((c) => (
              <Reveal key={c._id}>
                <Link
                  href={`/categories/${c._id}`}
                  className="card group relative block aspect-[4/5] overflow-hidden rounded-3xl"
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h2 className="text-lg font-bold text-white">{c.name}</h2>
                    <span className="mt-1 inline-block translate-y-2 text-sm text-brand-300 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      Explore →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
      </div>
    </section>
  );
}
