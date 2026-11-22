"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function getUserId(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).id;
  } catch {
    return null;
  }
}

function Step({ done, label, last }) {
  return (
    <div className={`flex items-center ${last ? "" : "flex-1"}`}>
      <div className="flex flex-col items-center gap-1.5">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all duration-500 ${
            done
              ? "border-brand-500 bg-brand-600 text-white shadow-[0_0_18px_-2px_var(--color-brand-500)]"
              : "border-line text-muted"
          }`}
        >
          {done ? "✓" : "•"}
        </span>
        <span
          className={`text-[11px] ${done ? "text-brand-400" : "text-muted"}`}
        >
          {label}
        </span>
      </div>
      {!last && (
        <div className="mx-2 mb-5 h-0.5 flex-1 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-300 transition-all duration-1000"
            style={{ width: done ? "100%" : "0%" }}
          />
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, open, onToggle }) {
  const date = new Date(order.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const isCash = order.paymentMethodType === "cash";
  const items = order.cartItems ?? [];

  return (
    <article className="card overflow-hidden rounded-3xl">
      <button onClick={onToggle} className="w-full p-5 text-left sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Order #{order.id}</p>
            <p className="mt-1 text-lg font-bold">{date}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="chip">{isCash ? "💵 Cash" : "💳 Card"}</span>
              <span className="chip">{items.length} items</span>
            </div>
          </div>

          <div className="text-right">
            <p className="gradient-text text-2xl font-extrabold">
              {order.totalOrderPrice} EGP
            </p>
            <p className="mt-1 text-sm text-muted">
              {open ? "Hide details ▲" : "View details ▼"}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-start">
          <Step done label="Placed" />
          <Step
            done={order.isPaid}
            label={isCash ? "Paid on delivery" : "Paid"}
          />
          <Step done={order.isDelivered} label="Delivered" last />
        </div>
      </button>

      {open && (
        <div className="page-enter border-t border-line p-5 sm:p-6">
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it._id} className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                  {it.product?.imageCover && (
                    <Image
                      src={it.product.imageCover}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  {it.product?._id ? (
                    <Link
                      href={`/products/${it.product._id}`}
                      className="line-clamp-1 font-medium hover:text-brand-400"
                    >
                      {it.product.title}
                    </Link>
                  ) : (
                    <p className="font-medium text-muted">
                      Product no longer available
                    </p>
                  )}
                  <p className="text-sm text-muted">
                    {it.count} × {it.price} EGP
                  </p>
                </div>
                <p className="font-semibold">{it.count * it.price} EGP</p>
              </li>
            ))}
          </ul>

          {order.shippingAddress && (
            <div className="mt-5 rounded-2xl border border-line p-4 text-sm">
              <p className="mb-1 font-semibold">📍 Shipping to</p>
              <p className="text-muted">
                {order.shippingAddress.details}, {order.shippingAddress.city}
              </p>
              <p className="text-muted">📞 {order.shippingAddress.phone}</p>
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export default function OrdersPage() {
  const { token } = useAuth();
  const { refresh } = useCart();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState(null);

  const userId = useMemo(() => (token ? getUserId(token) : null), [token]);

  useEffect(() => {
    refresh?.();
  }, [refresh]);

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    api
      .get(`/orders/user/${userId}`)
      .then((res) => {
        if (!alive) return;
        const list = Array.isArray(res.data) ? res.data : (res.data.data ?? []);
        const sorted = [...list].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setOrders(sorted);
        setOpenId(sorted[0]?._id ?? null);
      })
      .catch(() => alive && setError("Couldn't load your orders."));
    return () => {
      alive = false;
    };
  }, [userId]);

  if (!token) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="float mb-6 text-6xl">🔒</div>
        <h1 className="gradient-text text-3xl font-bold">
          Sign in to see your orders
        </h1>
        <Link href="/login" className="btn-primary mt-8 w-auto! px-8 py-3">
          Sign In
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <p className="chip mb-3">
          <span className="chip-dot" /> My Orders
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Order <span className="gradient-text">History</span>
        </h1>
      </div>

      {error && <p className="text-red-400">{error}</p>}

      {!orders && !error && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="skeleton h-44 rounded-3xl" />
          ))}
        </div>
      )}

      {orders && orders.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="float mb-6 text-7xl">📦</div>
          <h2 className="gradient-text text-2xl font-bold">No orders yet</h2>
          <p className="mt-2 text-muted">
            When you place an order, it&apos;ll show up here.
          </p>
          <Link href="/products" className="btn-primary mt-8 w-auto! px-8 py-3">
            Start Shopping
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <div className="space-y-5">
          {orders.map((o) => (
            <OrderCard
              key={o._id}
              order={o}
              open={openId === o._id}
              onToggle={() => setOpenId(openId === o._id ? null : o._id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
