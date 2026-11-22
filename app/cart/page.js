"use client";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const FREE_SHIPPING = 500;

function Skeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((n) => (
        <div key={n} className="skeleton h-32 rounded-2xl" />
      ))}
    </div>
  );
}

export default function CartPage() {
  const { token } = useAuth();
  const { items, count, total, busyId, updateQuantity, removeItem, clearCart } =
    useCart();

  const remaining = Math.max(FREE_SHIPPING - total, 0);
  const progress = Math.min((total / FREE_SHIPPING) * 100, 100);

  if (!token) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="float mb-6 text-6xl">🔒</div>
        <h1 className="gradient-text text-3xl font-bold">
          Sign in to see your cart
        </h1>
        <p className="mt-3 text-muted">Your cart is saved to your account.</p>
        <Link href="/login" className="btn-primary mt-8 w-auto! px-8 py-3">
          Sign In
        </Link>
      </section>
    );
  }

  if (!items || items.length === 0) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="float mb-6 text-7xl">🛸</div>
        <h1 className="gradient-text text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-muted">
          Looks like you haven&apos;t picked anything yet.
        </p>
        <Link href="/products" className="btn-primary mt-8 w-auto! px-8 py-3">
          Start Shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="chip mb-3">
            <span className="chip-dot" /> Shopping Cart
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Your <span className="gradient-text">Cart</span>
            <span className="ml-3 text-lg font-normal text-muted">
              ({count} items)
            </span>
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="rounded-full border border-line px-5 py-2 text-sm text-muted transition-colors hover:border-red-500 hover:text-red-400"
        >
          Clear cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {items.map((item) => {
            const p = item.product;
            const busy = busyId === p._id;
            return (
              <article
                key={item._id}
                className={`card flex gap-4 p-4 transition-opacity sm:gap-6 ${busy ? "opacity-60" : ""}`}
              >
                <Link
                  href={`/products/${p._id}`}
                  className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl bg-white sm:w-32"
                >
                  <Image
                    src={p.imageCover}
                    alt={p.title}
                    fill
                    sizes="128px"
                    className="object-contain p-2"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <p className="text-xs text-brand-400">{p.category?.name}</p>
                    <Link
                      href={`/products/${p._id}`}
                      className="line-clamp-2 font-semibold hover:text-brand-400"
                    >
                      {p.title}
                    </Link>
                    <p className="mt-1 text-sm text-muted">
                      {item.price} EGP each
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        disabled={busy}
                        onClick={() => updateQuantity(p._id, item.count - 1)}
                        className="h-9 w-9 rounded-full text-lg transition-colors hover:bg-brand-600/30"
                        aria-label="Decrease"
                      >
                        −
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">
                        {item.count}
                      </span>
                      <button
                        disabled={busy}
                        onClick={() => updateQuantity(p._id, item.count + 1)}
                        className="h-9 w-9 rounded-full text-lg transition-colors hover:bg-brand-600/30"
                        aria-label="Increase"
                      >
                        +
                      </button>
                    </div>

                    <p className="font-bold">{item.price * item.count} EGP</p>

                    <button
                      disabled={busy}
                      onClick={() => removeItem(p._id)}
                      className="text-sm text-muted transition-colors hover:text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="glass spin-border rounded-3xl p-6">
            <h2 className="text-xl font-bold">Order Summary</h2>

            <div className="mt-5">
              <p className="mb-2 text-sm text-muted">
                {remaining > 0
                  ? `Add ${remaining} EGP more for free shipping`
                  : "🎉 You got free shipping!"}
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-300 transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Items</dt>
                <dd>{count}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Shipping</dt>
                <dd>{remaining > 0 ? "Calculated at checkout" : "Free"}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-4 text-lg font-bold">
                <dt>Total</dt>
                <dd className="gradient-text">{total} EGP</dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="btn-primary mt-6 block w-full py-3 text-center"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              className="mt-3 block text-center text-sm text-muted hover:text-brand-400"
            >
              ← Continue shopping
            </Link>
          </div>
        </aside>
      </div>
    </section>
  );
}
