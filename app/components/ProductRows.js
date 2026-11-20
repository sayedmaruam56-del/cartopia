"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import api from "../lib/api";

export default function ProductRows({ rows = 3, tilt = -8, className = "" }) {
  const [imgs, setImgs] = useState([]);

  useEffect(() => {
    let alive = true;
    api
      .get("/products", { params: { limit: rows * 8 } })
      .then((res) => alive && setImgs(res.data.data.map((p) => p.imageCover)))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [rows]);

  if (imgs.length === 0) return null;

  const per = Math.ceil(imgs.length / rows);
  const chunks = Array.from({ length: rows }, (_, r) =>
    imgs.slice(r * per, r * per + per),
  );

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute -inset-x-1/4 inset-y-0 flex flex-col justify-center gap-4"
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {chunks.map((chunk, r) => (
          <div
            key={r}
            className={`row-track ${r % 2 ? "rev" : ""}`}
            style={{ marginLeft: `${r * -70}px` }}
          >
            {[...chunk, ...chunk].map((src, i) => (
              <div
                key={`${r}-${i}`}
                className="relative h-36 w-36 shrink-0 overflow-hidden rounded-3xl bg-white shadow-xl"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="144px"
                  className="object-contain p-2"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
