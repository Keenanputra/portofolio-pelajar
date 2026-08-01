import Reveal from "./Reveal";

const socialLinks = [
  { 
    name: "Instagram", 
    username: "@keenan13oc", 
    href: "https://instagram.com/keenan13oc",
    color: "from-pink-500 to-rose-500"
  },
  { 
    name: "YouTube", 
    username: "Keenan Dev", 
    href: "https://youtube.com/@keenan13oc",
    color: "from-red-500 to-red-600"
  },
  { 
    name: "TikTok", 
    username: "@keenan13oc", 
    href: "https://tiktok.com/@keenan13oc",
    color: "from-black to-gray-600"
  },
];

export default function SocialMedia() {
  return (
    <section id="sosmed" className="mx-auto max-w-6xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-muted">02.</span> Sosial Media
        </h2>
        <p className="mt-3 text-muted">
          Ikuti perjalanan belajar dan karya saya di platform sosial media.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-3">
        {socialLinks.map((social, i) => (
          <Reveal key={social.name} delay={i * 0.1}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="group h-full rounded-2xl border border-line bg-glass p-6 transition hover:border-foreground/30 hover:bg-glass-light hover:shadow-lg hover:shadow-foreground/5 backdrop-blur-xl"
            >
              <div className={`mb-4 h-12 w-12 rounded-xl bg-gradient-to-br ${social.color} p-0.5`}>
                <div className="h-full w-full rounded-[9px] bg-background flex items-center justify-center">
                  {social.name === "Instagram" && (
                    <svg className="h-6 w-6 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  {social.name === "YouTube" && (
                    <svg className="h-6 w-6 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  )}
                  {social.name === "TikTok" && (
                    <svg className="h-6 w-6 text-foreground" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-2.9 6.34-1.69 1.41-3.93 2.06-6.11 1.64-2.48-.48-4.59-2.38-5.79-4.73-1.3-2.48-1.54-5.43-.62-8.06.75-2.31 2.66-4.02 4.92-4.87 1.42-.52 2.91-.61 4.33-.25 1.33.35 2.56 1.24 3.45 2.48V.02h-.02zM7.695 19.68c1.26.52 2.69.42 3.92-.27v-6.16c-.55.34-1.11.66-1.7.96V19.68z"/>
                    </svg>
                  )}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{social.name}</h3>
              <p className="mt-1 text-sm text-muted">{social.username}</p>
              <div className="mt-3 flex items-center text-xs font-medium text-muted group-hover:text-foreground transition-colors">
                <span>Follow</span>
                <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
