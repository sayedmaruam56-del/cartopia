"use client";
import { useEffect, useRef } from "react";

export default function Marquee({ children, speed = 0.6, reverse = false }) {
  const track = useRef(null);

  useEffect(() => {
    const el = track.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dir = reverse ? 1 : -1;
    let x = reverse ? -el.scrollWidth / 2 : 0;
    let boost = 0;
    let lastY = window.scrollY;
    let raf;

    function onScroll() {
      const y = window.scrollY;
      boost = Math.min(Math.abs(y - lastY) * 0.15, 14);
      lastY = y;
    }

    function tick() {
      const half = el.scrollWidth / 2;
      x += dir * (speed + boost);
      boost *= 0.92;
      if (dir < 0 && x <= -half) x += half;
      if (dir > 0 && x >= 0) x -= half;
      el.style.transform = `translate3d(${x}px,0,0)`;
      raf = requestAnimationFrame(tick);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    tick();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [speed, reverse]);

  return (
    <div className="marquee-wrap">
      <div ref={track} className="flex w-max will-change-transform">
        {children}
        {children}
      </div>
    </div>
  );
}
