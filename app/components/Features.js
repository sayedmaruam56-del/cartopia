import Reveal from "./Reveal";

const FEATURES = [
  { icon: "🚚", title: "Free Shipping", text: "On orders over 500 EGP" },
  { icon: "🔒", title: "Secure Payment", text: "100% protected checkout" },
  { icon: "↩", title: "Easy Returns", text: "14-day hassle-free returns" },
  { icon: "💬", title: "24/7 Support", text: "We're always here to help" },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <Reveal key={f.title}>
            <div className="card group flex h-full items-center gap-4 rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1.5">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600/20 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                {f.icon}
              </span>
              <div>
                <p className="font-semibold">{f.title}</p>
                <p className="text-sm text-muted">{f.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
