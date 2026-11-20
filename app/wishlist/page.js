"use client";
import Link from "next/link";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import Reveal from "../components/Reveal";

export default function WishlistPage() {
  const { token } = useAuth();
  const { items } = useWishlist();

  if (!token) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="float mb-6 text-6xl">🔒</div>
        <h1 className="gradient-text text-3xl font-bold">
          Sign in to see your saved items
        </h1>
        <p className="mt-3 text-muted">
          Your wishlist is saved to your account.
        </p>
        <Link href="/login" className="btn-primary mt-8 px-8 py-3">
          Sign In
        </Link>
      </section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="float mb-6 text-7xl">💜</div>
        <h1 className="gradient-text text-3xl font-bold">Nothing saved yet</h1>
        <p className="mt-3 text-muted">
          Tap the heart on any product to keep it here for later.
        </p>
        <Link href="/products" className="btn-primary mt-8 px-8 py-3">
          Explore Products
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="chip mb-3">
          <span className="chip-dot" /> Wishlist
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Your <span className="gradient-text">Saved</span> Items
          <span className="ml-3 text-lg font-normal text-muted">
            ({items.length})
          </span>
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {items.map((p) => (
          <Reveal key={p._id}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
