import Link from "next/link";
import { notFound } from "next/navigation";

const PAGES = {
  help: {
    icon: "🛟",
    title: "Help Center",
    intro: "Quick answers to the things people ask most.",
    sections: [
      {
        h: "How do I place an order?",
        p: "Add products to your cart, open the cart, press Proceed to Checkout, enter your address and choose how to pay.",
      },
      {
        h: "Can I change my order?",
        p: "Contact support as soon as possible. Orders that haven't shipped can usually be updated.",
      },
      {
        h: "I forgot my password",
        p: "Use the Forgot Password link on the sign-in page. We'll email you a code to reset it.",
      },
    ],
  },
  shipping: {
    icon: "🚚",
    title: "Shipping Info",
    intro: "Where we deliver and how long it takes.",
    sections: [
      {
        h: "Delivery time",
        p: "Most orders arrive within 2 to 5 business days, depending on your city.",
      },
      {
        h: "Shipping cost",
        p: "Orders over 500 EGP ship free. Smaller orders show the exact fee at checkout.",
      },
      {
        h: "Tracking",
        p: "After your order ships you can follow its status anytime from the My Orders page.",
      },
    ],
  },
  returns: {
    icon: "↩️",
    title: "Returns & Refunds",
    intro: "Changed your mind? No stress.",
    sections: [
      {
        h: "14-day returns",
        p: "You can return most items within 14 days of delivery if they're unused and in original packaging.",
      },
      {
        h: "How to start a return",
        p: "Contact support with your order number and we'll guide you through the next steps.",
      },
      {
        h: "Refunds",
        p: "Approved refunds go back to your original payment method within 5 to 10 business days.",
      },
    ],
  },
  "track-order": {
    icon: "📍",
    title: "Track Your Order",
    intro: "See where your package is right now.",
    sections: [
      {
        h: "Where to look",
        p: "Sign in and open My Orders. Every order shows a live timeline: Placed, Paid and Delivered.",
      },
      {
        h: "Need more detail?",
        p: "Open an order to see its products, payment method and delivery address.",
      },
    ],
    cta: { label: "Go to My Orders", href: "/orders" },
  },
  privacy: {
    icon: "🔐",
    title: "Privacy Policy",
    intro: "How we handle your information.",
    sections: [
      {
        h: "What we collect",
        p: "Account details you give us (name, email, phone) and the information needed to deliver your orders.",
      },
      {
        h: "How we use it",
        p: "To process orders, improve the store and contact you about your purchases. We never sell your data.",
      },
      {
        h: "Your control",
        p: "You can change your password at any time and ask us to delete your account.",
      },
    ],
  },
  terms: {
    icon: "📜",
    title: "Terms of Service",
    intro: "The simple rules of using Cartopia.",
    sections: [
      {
        h: "Using the store",
        p: "By using Cartopia you agree to provide accurate information and to use the store lawfully.",
      },
      {
        h: "Orders & pricing",
        p: "Prices and availability can change. An order is confirmed once payment or cash-on-delivery is accepted.",
      },
      {
        h: "Accounts",
        p: "You're responsible for keeping your login details safe.",
      },
    ],
  },
  cookies: {
    icon: "🍪",
    title: "Cookie Policy",
    intro: "A tiny bit about the small files we use.",
    sections: [
      {
        h: "What we store",
        p: "We save your sign-in token and your theme preference (dark or light) in your browser so the site works the way you left it.",
      },
      {
        h: "Your choice",
        p: "You can clear this data from your browser settings at any time. You'll simply be signed out.",
      },
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export default async function InfoPage({ params }) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <div className="glass spin-border rounded-3xl p-8 text-center sm:p-10">
        <div className="float mb-4 text-6xl">{page.icon}</div>
        <h1 className="gradient-text text-4xl font-extrabold">{page.title}</h1>
        <p className="mt-3 text-muted">{page.intro}</p>
      </div>

      <div className="mt-8 space-y-4">
        {page.sections.map((s) => (
          <article key={s.h} className="card rounded-2xl p-6">
            <h2 className="text-lg font-semibold">{s.h}</h2>
            <p className="mt-2 leading-relaxed text-muted">{s.p}</p>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        {page.cta && (
          <Link href={page.cta.href} className="btn-primary w-auto! px-8 py-3">
            {page.cta.label}
          </Link>
        )}
        <Link
          href="/contact"
          className="glass rounded-full px-8 py-3 transition-colors hover:text-brand-400"
        >
          Still need help? Contact us
        </Link>
      </div>
    </section>
  );
}
