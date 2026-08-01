const socials = [
  { label: "GitHub", href: "https://github.com/Keenanputra" },
  { label: "Instagram", href: "https://www.instagram.com/keenandkiri/" },
];

export default function Footer() {
  return (
    <footer className="liquid-glass-nav border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="font-mono text-xs text-muted order-2 sm:order-1">
          © {new Date().getFullYear()} Keenan
        </p>
        <ul className="flex gap-4 sm:gap-6 text-sm order-1 sm:order-2">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="liquid-border-glow px-3 py-2 rounded-lg text-muted transition-all duration-300 hover:text-white hover:liquid-glass-light"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
