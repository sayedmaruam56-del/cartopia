"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "../lib/api";

export default function BrandsStrip() {
  const [brands, setBrands] = useState(null);

  useEffect(() => {
    let alive = true;
    api
      .get("/brands")
      .then((res) => alive && setBrands(res.data.data))
      .catch(() => alive && setBrands([]));
    return () => {
      alive = false;
    };
  }, []);

  if (brands && brands.length === 0) return null;

  // بنكرر القايمة مرتين عشان اللف يبقى متصل من غير فاصل
  const loop = brands ? [...brands, ...brands] : [];

  return (
    <section className="py-14">
      <div className="mx-auto mb-8 flex max-w-7xl items-end justify-between px-4">
        <div>
          <p className="chip mb-3 w-fit">
            <span className="chip-dot" /> Brands
          </p>
          <h2 className="text-3xl font-bold sm:text-4xl">
            Brands in <span className="gradient-text">orbit</span>
          </h2>
        </div>
        <Link href="/brands" className="text-sm text-brand-400 hover:underline">
          All brands →
        </Link>
      </div>

      <div className="brand-wrap overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        {!brands ? (
          <div className="skeleton mx-4 h-24 rounded-2xl" />
        ) : (
          <div className="brand-track gap-5">
            {loop.map((b, i) => (
              <Link
                key={`${b._id}-${i}`}
                href={`/brands/${b._id}`}
                className="relative mr-5 block h-24 w-44 shrink-0 overflow-hidden rounded-2xl bg-white p-3 transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_40px_-10px_var(--color-brand-500)]"
              >
                <Image
                  src={b.image}
                  alt={b.name}
                  fill
                  sizes="176px"
                  className="object-contain p-3"
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
