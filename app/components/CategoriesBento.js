"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "../lib/api";
import Reveal from "./Reveal";

export default function CategoriesBento() {
  const [cats, setCats] = useState(null);

  useEffect(() => {
    let alive = true;
    api
      .get("/categories")
      .then((res) => alive && setCats(res.data.data.slice(0, 5)))
      .catch(() => alive && setCats([]));
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="chip mb-3 w-fit">
            <span className="chip-dot" /> Categories
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Shop by <span className="gradient-text">universe</span>
          </h2>
        </div>
        <Link
          href="/categories"
          className="text-sm text-brand-400 hover:underline"
        >
          View all categories →
        </Link>
      </div>

      <div className="grid auto-rows-[170px] grid-cols-2 gap-4 md:auto-rows-[210px] md:grid-cols-4">
        {!cats
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`skeleton rounded-3xl ${i === 0 ? "col-span-2 row-span-2" : ""}`}
              />
            ))
          : cats.map((c, i) => (
              <Reveal
                key={c._id}
                className={i === 0 ? "col-span-2 row-span-2" : ""}
              >
                <Link
                  href={`/categories/${c._id}`}
                  className="card group relative block h-full overflow-hidden rounded-3xl"
                >
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes={i === 0 ? "50vw" : "25vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3
                      className={`font-bold text-white ${i === 0 ? "text-2xl" : "text-lg"}`}
                    >
                      {c.name}
                    </h3>
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
