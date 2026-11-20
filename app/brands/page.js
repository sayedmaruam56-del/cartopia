"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "../lib/api";
import Reveal from "../components/Reveal";

export default function BrandsPage() {
  const [brands, setBrands] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    api
      .get("/brands")
      .then((res) => alive && setBrands(res.data.data))
      .catch(() => alive && setError("Couldn't load brands."));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-10 text-center">
        <p className="chip mx-auto mb-3 w-fit">
          <span className="chip-dot" /> Top names
        </p>
        <h1 className="text-4xl font-bold sm:text-5xl">
          Shop by <span className="gradient-text">Brand</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          The brands you love, all in one orbit.
        </p>
      </div>

      {error && <p className="text-center text-red-400">{error}</p>}

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
        {!brands && !error
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="skeleton aspect-square rounded-3xl" />
            ))
          : brands?.map((b) => (
              <Reveal key={b._id}>
                <Link
                  href={`/brands/${b._id}`}
                  className="card group flex aspect-square flex-col items-center justify-center gap-3 rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="relative h-24 w-full">
                    <Image
                      src={b.image}
                      alt={b.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h2 className="text-sm font-semibold text-muted transition-colors group-hover:text-brand-400">
                    {b.name}
                  </h2>
                </Link>
              </Reveal>
            ))}
      </div>
    </section>
  );
}
