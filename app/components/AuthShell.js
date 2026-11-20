import { BRAND } from "../lib/brand";
export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden">
      

      <section className="relative z-10 hidden lg:flex flex-col justify-between p-12">
        <div className="text-2xl font-extrabold gradient-text">{BRAND.name}</div>
        <div>
          <h2 className="text-5xl font-extrabold leading-tight">
            Shop the <span className="gradient-text">future</span>,
            <br /> one click away.
          </h2>
          <p className="text-muted mt-5 max-w-md">
            Thousands of products from top brands, delivered fast with secure payment.
          </p>
          <ul className="mt-8 space-y-3 text-brand-200">
            <li>✦ Free shipping over 500 EGP</li>
            <li>✦ Easy 14-day returns</li>
            <li>✦ Cash or online payment</li>
          </ul>
        </div>
        <p className="text-muted text-sm">© 2026 {BRAND.name}</p>
      </section>

      <section className="relative z-10 flex items-center justify-center px-4 py-10">
        <div className="glass spin-border w-full max-w-md rounded-3xl p-8">
          <h1 className="text-3xl font-extrabold gradient-text">{title}</h1>
          <p className="text-muted mt-1 mb-6">{subtitle}</p>
          {children}
        </div>
      </section>
    </div>
  );
}
