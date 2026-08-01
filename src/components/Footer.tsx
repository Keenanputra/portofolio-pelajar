const socials = [
  { label: "GitHub", href: "https://github.com/keenan13oc" },
  { label: "LinkedIn", href: "https://linkedin.com/in/keenan13oc" },
  { label: "Instagram", href: "https://instagram.com/keenan13oc" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="font-mono text-xs text-muted">© {new Date().getFullYear()} Keenan</p>
        <ul className="flex gap-6 text-sm">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="text-muted transition hover:text-accent">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
