"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { id: "tentang", label: "Tentang" },
  { id: "skill", label: "Skill" },
  { id: "proyek", label: "Proyek" },
  { id: "organisasi", label: "Organisasi" },
  { id: "blog", label: "Blog" },
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "border-b border-white/10 bg-background/80 backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/#hero" className="font-mono text-sm font-semibold text-accent">
          Keenan.dev
        </Link>
        <button
          type="button"
          className="text-foreground sm:hidden"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "✕" : "☰"}
        </button>
        <ul className={`gap-6 text-sm sm:flex ${open ? "absolute inset-x-0 top-full flex flex-col gap-4 border-b border-white/10 bg-background px-6 py-4" : "hidden"}`}>
          {links.map((link) => (
            <li key={link.id}>
              <a
                href={`/#${link.id}`}
                onClick={() => setOpen(false)}
                className={`transition hover:text-accent ${active === `#${link.id}` ? "text-accent" : "text-muted"}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
