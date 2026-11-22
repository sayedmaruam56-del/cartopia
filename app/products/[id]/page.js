"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "../../lib/api";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import ProductCard from "../../components/ProductCard";
import Reviews from "../../components/Reviews";

function DetailsSkeleton() {
  return (
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 lg:grid-cols-2">
      <div className="skeleton aspect-square rounded-3xl" />
      <div className="space-y-4">
        <div className="skeleton h-5 w-32 rounded-full" />
        <div className="skeleton h-10 w-3/4 rounded-xl" />
        <div className="skeleton h-6 w-40 rounded-xl" />
        <div className="skeleton h-28 w-full rounded-xl" />
        <div className="skeleton h-12 w-full rounded-full" />
      </div>
    </div>
  );
}

function Details({ id }) {
  const { addToCart, busyId } = useCart();
  const { has, toggle } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    let alive = true;
    api
      .get(`/products/${id}`)
      .then((res) => alive && setProduct(res.data.data))
      .catch(() => alive && setError("We couldn't load this product."));
    return () => {
      alive = false;
    };
  }, [id]);

  const categoryId = product?.category?._id;
  useEffect(() => {
    if (!categoryId) return;
    let alive = true;
    api
      .get("/products", { params: { "category[in]": categoryId, limit: 5 } })
      .then((res) => {
        if (!alive) return;
        setRelated(res.data.data.filter((p) => p._id !== id).slice(0, 4));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [categoryId, id]);

  if (error) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="mb-6 text-6xl">😵</div>
        <h1 className="gradient-text text-3xl font-bold">{error}</h1>
        <Link href="/products" className="btn-primary mt-8 w-auto! px-8 py-3">
          Back to Shop
        </Link>
      </section>
    );
  }

  if (!product) return <DetailsSkeleton />;

  const images = product.images?.length ? product.images : [product.imageCover];
  const hasDiscount =
    product.priceAfterDiscount && product.priceAfterDiscount < product.price;
  const finalPrice = hasDiscount ? product.priceAfterDiscount : product.price;
  const off = hasDiscount
    ? Math.round(((product.price - finalPrice) / product.price) * 100)
    : 0;
  const saved = has(product._id);
  const adding = busyId === product._id;
  const inStock = product.quantity > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted">
        <Link href="/" className="hover:text-brand-400">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-brand-400">
          Shop
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/categories/${product.category._id}`}
              className="hover:text-brand-400"
            >
              {product.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="glass spin-border relative aspect-square overflow-hidden rounded-3xl bg-white">
            <Image
              key={images[active]}
              src={images[active]}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="page-enter object-contain p-6"
            />
            {off > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-sm font-bold text-white">
                -{off}%
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white transition-all ${
                    i === active
                      ? "ring-2 ring-brand-500"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-wrap gap-2">
            {product.category && (
              <Link
                href={`/categories/${product.category._id}`}
                className="chip"
              >
                {product.category.name}
              </Link>
            )}
            {product.brand && (
              <Link href={`/brands/${product.brand._id}`} className="chip">
                {product.brand.name}
              </Link>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <span className="text-yellow-400">★ {product.ratingsAverage}</span>
            <span className="text-muted">
              ({product.ratingsQuantity} reviews)
            </span>
            <span className="text-muted">•</span>
            <span className="text-muted">{product.sold ?? 0} sold</span>
          </div>

          <div className="mt-6 flex items-end gap-4">
            <span className="gradient-text text-4xl font-extrabold">
              {finalPrice} EGP
            </span>
            {hasDiscount && (
              <span className="mb-1 text-lg text-muted line-through">
                {product.price} EGP
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-muted">
            {product.description}
          </p>

          <p
            className={`mt-6 text-sm font-medium ${inStock ? "text-emerald-400" : "text-red-400"}`}
          >
            {inStock
              ? `● In stock (${product.quantity} available)`
              : "● Out of stock"}
          </p>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => addToCart(product._id)}
              disabled={adding || !inStock}
              className="btn-primary flex-1 py-3.5 text-base disabled:opacity-60"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={() => toggle(product._id)}
              aria-label="Save to wishlist"
              className={`flex h-[52px] w-[52px] items-center justify-center rounded-full border text-2xl transition-colors ${
                saved
                  ? "border-brand-500 bg-brand-600/20 text-brand-400"
                  : "border-line text-muted hover:border-brand-500 hover:text-brand-400"
              }`}
            >
              <span key={String(saved)} className="heart-pop">
                {saved ? "♥" : "♡"}
              </span>
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-muted">
            <div className="card p-3">
              🚚
              <br />
              Fast delivery
            </div>
            <div className="card p-3">
              🔒
              <br />
              Secure payment
            </div>
            <div className="card p-3">
              ↩<br />
              Easy returns
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Reviews productId={product._id} />
      </div>
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 text-2xl font-bold">
            You may also <span className="gradient-text">like</span>
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function ProductDetailsPage() {
  const { id } = useParams();
  return <Details key={id} id={id} />;
}
