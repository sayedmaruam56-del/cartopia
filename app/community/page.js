"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Reveal from "../components/Reveal";

function decode(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(decodeURIComponent(escape(atob(payload))));
  } catch {
    return {};
  }
}

const GRADIENTS = [
  "from-brand-400 to-brand-800",
  "from-fuchsia-400 to-violet-700",
  "from-indigo-400 to-purple-700",
  "from-pink-400 to-brand-700",
];

const SEED = [
  {
    id: 1,
    name: "Sara M.",
    time: "2h ago",
    tag: "Review",
    text: "Ordered on Monday, arrived Wednesday and the quality is even better than the photos. Packaging was so neat too 💜",
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    name: "Omar K.",
    time: "5h ago",
    tag: "Tip",
    text: "Pro tip: save everything you like to your wishlist. When the price drops you can grab it in one tap.",
    likes: 41,
    comments: 9,
  },
  {
    id: 3,
    name: "Nour A.",
    time: "Yesterday",
    tag: "Question",
    text: "Does anyone know the best category for gifts under 500 EGP? Looking for ideas for my sister's birthday 🎁",
    likes: 12,
    comments: 14,
  },
  {
    id: 4,
    name: "Youssef H.",
    time: "2 days ago",
    tag: "Review",
    text: "Cash on delivery made it super easy to trust a new store. Smooth checkout, fast support. Will order again.",
    likes: 33,
    comments: 3,
  },
];

const TAGS = ["Review", "Tip", "Question"];
const TOP = [
  { name: "Sara M.", pts: "1.2k" },
  { name: "Omar K.", pts: "980" },
  { name: "Nour A.", pts: "760" },
];

function Avatar({ name, size = "h-11 w-11" }) {
  const g = GRADIENTS[name.charCodeAt(0) % GRADIENTS.length];
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${g} font-bold text-white`}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function CommunityPage() {
  const { token } = useAuth();
  const user = useMemo(() => (token ? decode(token) : {}), [token]);

  const [posts, setPosts] = useState(SEED);
  const [liked, setLiked] = useState({});
  const [text, setText] = useState("");
  const [tag, setTag] = useState("Review");
  const [filter, setFilter] = useState("All");
  const [trending, setTrending] = useState(null);

  useEffect(() => {
    let alive = true;
    api
      .get("/products", { params: { sort: "-ratingsAverage", limit: 4 } })
      .then((res) => alive && setTrending(res.data.data))
      .catch(() => alive && setTrending([]));
    return () => {
      alive = false;
    };
  }, []);

  function publish(e) {
    e.preventDefault();
    if (text.trim().length < 3) return;
    setPosts((p) => [
      {
        id: Date.now(),
        name: user.name || "You",
        time: "Just now",
        tag,
        text: text.trim(),
        likes: 0,
        comments: 0,
        fresh: true,
      },
      ...p,
    ]);
    setText("");
  }

  function toggleLike(id) {
    const on = !liked[id];
    setLiked((l) => ({ ...l, [id]: on }));
    setPosts((p) =>
      p.map((x) =>
        x.id === id ? { ...x, likes: x.likes + (on ? 1 : -1) } : x,
      ),
    );
  }

  const shown =
    filter === "All" ? posts : posts.filter((p) => p.tag === filter);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="glass spin-border relative mb-10 overflow-hidden rounded-3xl p-8 text-center sm:p-12">
        <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative">
          <p className="chip mx-auto mb-3 w-fit">
            <span className="chip-dot" /> Community
          </p>
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            The <span className="gradient-text">Cartopian</span> hub
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Share finds, ask questions and swap tips with fellow shoppers.
          </p>
          <div className="mt-6 flex justify-center gap-8">
            {[
              ["12k+", "Members"],
              ["3.4k", "Reviews"],
              ["98%", "Happy"],
            ].map(([n, l]) => (
              <div key={l}>
                <p className="gradient-text text-2xl font-extrabold">{n}</p>
                <p className="text-xs text-muted">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="card rounded-3xl p-5">
            {token ? (
              <form onSubmit={publish}>
                <div className="flex gap-3">
                  <Avatar name={user.name || "You"} />
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Share something with the community..."
                    className="input min-h-24 flex-1"
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-2">
                    {TAGS.map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setTag(t)}
                        className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                          tag === t
                            ? "border-brand-500 bg-brand-600/20 text-brand-400"
                            : "border-line text-muted hover:border-brand-500/50"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="btn-primary w-auto! px-6 py-2 text-sm"
                  >
                    Post
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-4 text-center">
                <p className="text-muted">Sign in to join the conversation.</p>
                <Link
                  href="/login"
                  className="btn-primary mt-4 inline-block w-auto! px-8 py-2.5"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {["All", ...TAGS].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  filter === f
                    ? "border-brand-500 bg-brand-600/20 text-brand-400"
                    : "border-line text-muted hover:border-brand-500/50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {shown.map((p) => (
            <Reveal key={p.id}>
              <article
                className={`card rounded-3xl p-5 ${p.fresh ? "page-enter" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <Avatar name={p.name} />
                  <div className="flex-1">
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted">{p.time}</p>
                  </div>
                  <span className="chip">{p.tag}</span>
                </div>
                <p className="mt-4 leading-relaxed">{p.text}</p>
                <div className="mt-4 flex items-center gap-5 border-t border-line pt-3 text-sm text-muted">
                  <button
                    onClick={() => toggleLike(p.id)}
                    className={`flex items-center gap-1.5 transition-colors hover:text-brand-400 ${liked[p.id] ? "text-brand-400" : ""}`}
                  >
                    <span
                      key={String(!!liked[p.id])}
                      className="heart-pop text-lg"
                    >
                      {liked[p.id] ? "♥" : "♡"}
                    </span>
                    {p.likes}
                  </button>
                  <span>💬 {p.comments}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <aside className="space-y-6">
          <div className="card rounded-3xl p-5">
            <h2 className="mb-4 font-bold">🔥 Trending products</h2>
            <div className="space-y-3">
              {!trending
                ? [1, 2, 3, 4].map((n) => (
                    <div key={n} className="skeleton h-16 rounded-xl" />
                  ))
                : trending.map((p) => (
                    <Link
                      key={p._id}
                      href={`/products/${p._id}`}
                      className="group flex items-center gap-3"
                    >
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                        <Image
                          src={p.imageCover}
                          alt=""
                          fill
                          sizes="56px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-sm font-medium transition-colors group-hover:text-brand-400">
                          {p.title}
                        </p>
                        <p className="text-xs text-muted">
                          ★ {p.ratingsAverage} ·{" "}
                          {p.priceAfterDiscount ?? p.price} EGP
                        </p>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>

          <div className="card rounded-3xl p-5">
            <h2 className="mb-4 font-bold">🏆 Top Cartopians</h2>
            <div className="space-y-3">
              {TOP.map((u, i) => (
                <div key={u.name} className="flex items-center gap-3">
                  <span className="w-5 text-center text-sm text-muted">
                    {i + 1}
                  </span>
                  <Avatar name={u.name} size="h-9 w-9" />
                  <p className="flex-1 text-sm font-medium">{u.name}</p>
                  <span className="text-xs text-brand-400">{u.pts} pts</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
