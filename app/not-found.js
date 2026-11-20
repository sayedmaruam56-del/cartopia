import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <div className="float text-8xl">🛸</div>
      <h1 className="gradient-text mt-6 text-8xl font-extrabold sm:text-9xl">
        404
      </h1>
      <p className="mt-3 text-2xl font-semibold">Lost in space</p>
      <p className="mt-2 max-w-md text-muted">
        The page you&apos;re looking for drifted out of orbit. Let&apos;s get
        you back on course.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary w-auto! px-8 py-3">
          Back Home
        </Link>
        <Link
          href="/products"
          className="glass rounded-full px-8 py-3 transition-colors hover:text-brand-400"
        >
          Browse Shop
        </Link>
      </div>
    </section>
  );
}
