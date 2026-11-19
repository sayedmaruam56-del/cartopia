"use client";

export default function Error({ reset }) {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 text-7xl">⚡</div>
      <h1 className="gradient-text text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-muted">
        A small glitch in the matrix. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="btn-primary mt-8 w-auto! px-8 py-3"
      >
        Try again
      </button>
    </section>
  );
}
