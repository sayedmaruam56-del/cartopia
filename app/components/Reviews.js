"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";

function getUserId(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).id;
  } catch {
    return null;
  }
}

function Stars({ value, className = "" }) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className={className} aria-label={`${v} out of 5`}>
      <span className="text-yellow-400">{"★".repeat(v)}</span>
      <span className="text-line">{"★".repeat(5 - v)}</span>
    </span>
  );
}

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          aria-label={`${n} stars`}
          className={`text-4xl transition-all duration-200 hover:scale-125 ${
            n <= shown
              ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]"
              : "text-line"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ initial, label, busy, onSubmit, onCancel }) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [text, setText] = useState(initial?.review ?? "");
  const [localError, setLocalError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!rating) return setLocalError("Please choose a star rating.");
    if (text.trim().length < 3)
      return setLocalError("Write at least a few words.");
    setLocalError("");
    onSubmit({ rating, review: text.trim() });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <StarPicker value={rating} onChange={setRating} />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share what you liked or didn't like..."
        className="input min-h-28"
      />
      {localError && <p className="text-sm text-red-400">{localError}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="btn-primary w-auto! px-8 py-2.5 text-sm disabled:opacity-60"
        >
          {busy ? "Saving..." : label}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="glass rounded-full px-6 py-2.5 text-sm"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function Reviews({ productId }) {
  const { token } = useAuth();
  const userId = useMemo(() => (token ? getUserId(token) : null), [token]);

  const [reviews, setReviews] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    () =>
      api
        .get(`/products/${productId}/reviews`, { params: { limit: 50 } })
        .then((res) =>
          setReviews(
            [...res.data.data].sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            ),
          ),
        )
        .catch(() => setReviews([])),
    [productId],
  );

  useEffect(() => {
    load();
  }, [load]);

  const mine = reviews?.find((r) => r.user?._id === userId);
  const total = reviews?.length ?? 0;
  const average = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const counts = [5, 4, 3, 2, 1].map((n) => ({
    n,
    c: reviews?.filter((r) => Math.round(r.rating) === n).length ?? 0,
  }));

  async function run(action) {
    setBusy(true);
    setError("");
    try {
      await action();
      setEditingId(null);
      await load();
    } catch (err) {
      setError(
        err.response?.data?.errors?.msg ||
          err.response?.data?.message ||
          "Something went wrong. Try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const create = (body) =>
    run(() => api.post(`/products/${productId}/reviews`, body));
  const update = (id, body) => run(() => api.put(`/reviews/${id}`, body));
  const remove = (id) => run(() => api.delete(`/reviews/${id}`));

  return (
    <section id="reviews">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="chip mb-3 w-fit">
            <span className="chip-dot" /> Reviews
          </p>
          <h2 className="text-3xl font-bold">
            Customer <span className="gradient-text">reviews</span>
          </h2>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        <div className="space-y-6">
          <div className="glass spin-border rounded-3xl p-6 text-center">
            <p className="gradient-text text-6xl font-extrabold">
              {total ? average.toFixed(1) : "–"}
            </p>
            <Stars value={average} className="mt-2 block text-2xl" />
            <p className="mt-1 text-sm text-muted">
              {total} {total === 1 ? "review" : "reviews"}
            </p>

            <div className="mt-5 space-y-2">
              {counts.map(({ n, c }) => (
                <div key={n} className="flex items-center gap-3 text-xs">
                  <span className="w-3 text-muted">{n}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 to-fuchsia-400 transition-all duration-1000"
                      style={{ width: total ? `${(c / total) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="w-5 text-right text-muted">{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card rounded-3xl p-6">
            {!token ? (
              <div className="text-center">
                <p className="text-muted">Sign in to share your experience.</p>
                <Link
                  href="/login"
                  className="btn-primary mt-4 inline-block w-auto! px-8 py-2.5 text-sm"
                >
                  Sign In
                </Link>
              </div>
            ) : mine ? (
              <p className="text-center text-sm text-muted">
                You already reviewed this product. You can edit or delete your
                review from the list.
              </p>
            ) : (
              <>
                <h3 className="mb-4 font-semibold">Write a review</h3>
                <ReviewForm label="Post review" busy={busy} onSubmit={create} />
              </>
            )}
            {error && (
              <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {!reviews &&
            [1, 2, 3].map((n) => (
              <div key={n} className="skeleton h-32 rounded-3xl" />
            ))}

          {reviews && reviews.length === 0 && (
            <div className="card rounded-3xl py-14 text-center">
              <div className="mb-3 text-5xl">⭐</div>
              <p className="font-semibold">No reviews yet</p>
              <p className="mt-1 text-sm text-muted">
                Be the first to review this product.
              </p>
            </div>
          )}

          {reviews?.map((r) => {
            const own = r.user?._id === userId;
            const name = r.user?.name || "Customer";
            return (
              <article key={r._id} className="card page-enter rounded-3xl p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-800 font-bold text-white">
                    {name.charAt(0).toUpperCase()}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-3">
                      <p className="font-semibold">{name}</p>
                      {own && <span className="chip">You</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <Stars value={r.rating} className="text-sm" />
                      <span>
                        {new Date(r.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {editingId === r._id ? (
                  <div className="mt-4">
                    <ReviewForm
                      initial={r}
                      label="Save changes"
                      busy={busy}
                      onSubmit={(body) => update(r._id, body)}
                      onCancel={() => setEditingId(null)}
                    />
                  </div>
                ) : (
                  <>
                    <p className="mt-4 leading-relaxed">{r.review}</p>
                    {own && (
                      <div className="mt-4 flex gap-4 text-sm">
                        <button
                          onClick={() => setEditingId(r._id)}
                          className="text-brand-400 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(r._id)}
                          disabled={busy}
                          className="text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
