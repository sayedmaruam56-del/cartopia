import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CursorGlow from "./components/CursorGlow";
import Background from "./components/Background";
import { BRAND } from "./lib/brand";
import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import AnnouncementBar from "./components/AnnouncementBar";
import Script from "next/script";
import ScrollToTop from "./components/ScrollToTop";
import Splash from "./components/Splash";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: `${BRAND.name} | ${BRAND.tagline}`,
  description: `${BRAND.name} - ${BRAND.tagline}`,
};

export default function RootLayout({ children }) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme')||'dark';document.documentElement.dataset.theme=t;}catch(e){}`,
          }}
        />
      </head>

      <body className="min-h-full flex flex-col">
        <Splash />
        <AuthProvider>
          <ToastProvider>
            <CartProvider>
              <WishlistProvider>
                <Background />
                <CursorGlow />
                <AnnouncementBar />
                <Navbar />

                <main className="flex-1">{children}</main>

                <Footer />
                <ScrollToTop />
              </WishlistProvider>
            </CartProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
