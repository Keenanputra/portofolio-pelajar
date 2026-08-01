"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MotionHeader } from "./MotionComponents";

const links = [
  { id: "tentang", label: "Tentang" },
  { id: "sosmed", label: "Sosial Media" },
  { id: "organisasi", label: "Organisasi" },
  { id: "kontak", label: "Kontak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const link of links) {
      const el = document.getElementById(link.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <MotionHeader
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 gpu-accelerated ${
        scrolled ? "liquid-glass-nav shadow-lg shadow-black/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link 
          href="/#hero" 
          className="font-mono text-sm font-bold text-foreground hover:text-white transition-colors duration-300"
        >
          Keenan.dev
        </Link>
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="liquid-glass-accent p-2 text-foreground hover:text-white sm:hidden transition-colors duration-300"
            aria-label="Buka menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <svg 
              className={`h-5 w-5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <ul className={`hidden sm:flex gap-1 text-sm transition-all duration-300`}>
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`/#${link.id}`}
                  onClick={() => setOpen(false)}
                  className={`liquid-border-glow px-3 py-2 rounded-lg transition-all duration-300 block ${
                    active === `#${link.id}` 
                      ? "text-white font-semibold liquid-glass-accent" 
                      : "text-muted hover:text-white hover:liquid-glass-light"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {open && (
          <ul className="absolute inset-x-4 top-full flex flex-col gap-2 liquid-glass-medium rounded-2xl px-4 py-4 shadow-xl border border-white/10 sm:hidden">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={`/#${link.id}`}
                  onClick={() => setOpen(false)}
                  className={`liquid-border-glow px-3 py-2.5 rounded-lg transition-all duration-300 block ${
                    active === `#${link.id}` 
                      ? "text-white font-semibold liquid-glass-accent" 
                      : "text-muted hover:text-white hover:liquid-glass-light"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </MotionHeader>
  );
}
