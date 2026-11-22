"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const METHODS = [
  {
    id: "cash",
    icon: "💵",
    title: "Cash on Delivery",
    desc: "Pay when your order arrives at your door.",
  },
  {
    id: "online",
    icon: "💳",
    title: "Pay Online",
    desc: "Secure card payment powered by Stripe.",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { token } = useAuth();
  const { items, count, total, cartId, refresh } = useCart();

  const [form, setForm] = useState({ details: "", phone: "", city: "" });
  const [method, setMethod] = useState("cash");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    const e = {};
    if (form.details.trim().length < 5)
      e.details = "Please enter your full address.";
    if (!/^01[0125][0-9]{8}$/.test(form.phone.trim()))
      e.phone = "Enter a valid Egyptian number (01XXXXXXXXX).";
    if (form.city.trim().length < 2) e.city = "City is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setApiError("");
    if (!validate()) return;

    setLoading(true);
    const body = {
      shippingAddress: {
        details: form.details.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
      },
    };

    try {
      if (method === "cash") {
        await api.post(`/orders/${cartId}`, body);
        await refresh?.();
        router.push("/orders");
      } else {
        const res = await api.post(`/orders/checkout-session/${cartId}`, body, {
          params: { url: window.location.origin },
        });
        window.location.href = res.data.session.url;
      }
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  }
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    api
      .get("/addresses")
      .then((res) => alive && setSavedAddresses(res.data.data))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [token]);
  if (!token) {
    return (
      <section className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
        <div className="float mb-6 text-6xl">🔒</div>
        <h1 className="gradient-text text-3xl font-bold">
          Sign in to checkout
        </h1>
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
        <h1 className="gradient-text text-3xl font-bold">
          Nothing to checkout
        </h1>
        <p className="mt-3 text-muted">Your cart is empty.</p>
        <Link href="/products" className="btn-primary mt-8 w-auto! px-8 py-3">
          Start Shopping
        </Link>
      </section>
    );
  }

  const field = (name, label, placeholder, type = "text") => (
    <div>
      <label className="mb-2 block text-sm font-medium text-muted">
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={set(name)}
        placeholder={placeholder}
        className="input"
      />
      {errors[name] && (
        <p className="mt-1.5 text-xs text-red-400">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8">
        <p className="chip mb-3">
          <span className="chip-dot" /> Secure Checkout
        </p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Almost <span className="gradient-text">there</span>
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-8 lg:grid-cols-[1fr_400px]"
      >
        <div className="space-y-6">
          <div className="card rounded-3xl p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                1
              </span>
              <h2 className="text-xl font-bold">Shipping address</h2>
            </div>
            {savedAddresses.length > 0 && (
              <div className="mb-6 flex flex-wrap gap-3">
                {savedAddresses.map((a) => (
                  <button
                    type="button"
                    key={a._id}
                    onClick={() =>
                      setForm({
                        details: a.details,
                        phone: a.phone,
                        city: a.city,
                      })
                    }
                    className="glass rounded-2xl px-4 py-2 text-left text-sm transition-colors hover:text-brand-300"
                  >
                    <span className="font-semibold">{a.name}</span>
                    <span className="block text-xs text-muted">{a.city}</span>
                  </button>
                ))}
              </div>
            )}
            <div className="space-y-5">
              {field(
                "details",
                "Address details",
                "Street, building, floor, apartment...",
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                {field("phone", "Phone", "01XXXXXXXXX", "tel")}
                {field("city", "City", "Cairo")}
              </div>
            </div>
          </div>

          <div className="card rounded-3xl p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                2
              </span>
              <h2 className="text-xl font-bold">Payment method</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {METHODS.map((m) => {
                const on = method === m.id;
                return (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`relative rounded-2xl border p-5 text-left transition-all duration-300 ${
                      on
                        ? "border-brand-500 bg-brand-600/15 shadow-[0_0_30px_-5px_var(--color-brand-500)]"
                        : "border-line hover:border-brand-500/50"
                    }`}
                  >
                    <span className="text-3xl">{m.icon}</span>
                    <p className="mt-3 font-semibold">{m.title}</p>
                    <p className="mt-1 text-sm text-muted">{m.desc}</p>
                    <span
                      className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border text-xs transition-all ${
                        on
                          ? "scale-100 border-brand-500 bg-brand-500 text-white"
                          : "scale-90 border-line text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="h-fit lg:sticky lg:top-28">
          <div className="glass spin-border rounded-3xl p-6">
            <h2 className="text-xl font-bold">Your order</h2>

            <ul className="mt-5 max-h-64 space-y-3 overflow-y-auto pr-1">
              {items.map((item) => (
                <li key={item._id} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                    <Image
                      src={item.product.imageCover}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                    <span className="absolute -right-0 -top-0 rounded-bl-lg bg-brand-600 px-1.5 text-[10px] font-bold text-white">
                      {item.count}
                    </span>
                  </div>
                  <p className="line-clamp-2 flex-1 text-sm">
                    {item.product.title}
                  </p>
                  <p className="text-sm font-semibold">
                    {item.price * item.count}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Items</dt>
                <dd>{count}</dd>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <dt>Total</dt>
                <dd className="gradient-text">{total} EGP</dd>
              </div>
            </dl>

            {apiError && (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {apiError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-6 w-full py-3.5 text-base disabled:opacity-60"
            >
              {loading
                ? "Processing..."
                : method === "cash"
                  ? "Place Order"
                  : "Pay Securely →"}
            </button>
            <p className="mt-3 text-center text-xs text-muted">
              🔒 Your information is encrypted and safe.
            </p>
            <Link
              href="/cart"
              className="mt-3 block text-center text-sm text-muted hover:text-brand-400"
            >
              ← Back to cart
            </Link>
          </div>
        </aside>
      </form>
    </section>
  );
}
