"use client";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const { _id, title, imageCover, price, priceAfterDiscount, ratingsAverage, category } = product;
  const hasDiscount = priceAfterDiscount && priceAfterDiscount < price;
  const off = hasDiscount ? Math.round(((price - priceAfterDiscount) / price) * 100) : 0;

  return (
    <div className="group card glow-border relative overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_rgba(124,58,237,0.9)]">
      <div className="relative aspect-square overflow-hidden bg-surface">
        <Link href={`/products/${_id}`} className="absolute inset-0 block">
          <Image
            src={imageCover}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-600 px-2.5 py-1 text-xs font-bold on-brand shadow-lg">
            -{off}%
          </span>
        )}

        {/* القلب: هنوصّله بالـ Wishlist في الخطوة الجاية */}
        <button
          aria-label="Save to wishlist"
          className="glass absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full text-brand-200 transition-all hover:scale-110 hover:bg-brand-600/40 hover:text-white"
        >
          ♡
        </button>

        {/* زر Add to Cart: هنوصّله بالـ Cart في الخطوة الجاية */}
        <button className="btn-primary absolute inset-x-3 bottom-3 z-10 !w-auto translate-y-14 text-sm opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          Add to Cart
        </button>
      </div>

      <Link href={`/products/${_id}`} className="block p-4">
        <p className="text-[11px] uppercase tracking-wider text-brand-300">{category?.name}</p>
        <h3 className="mt-1 line-clamp-1 text-sm font-semibold text-white">{title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <p className="flex items-baseline gap-2">
            <span className="gradient-text font-extrabold">{priceAfterDiscount ?? price} EGP</span>
            {hasDiscount && <span className="text-xs text-muted line-through">{price}</span>}
          </p>
          <span className="text-sm text-brand-300">★ {ratingsAverage}</span>
        </div>
      </Link>
    </div>
  );
}