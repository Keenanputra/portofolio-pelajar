"use client";
import Reveal from "./Reveal";
import { MotionA, MotionDiv, MotionH3, MotionP, MotionSvg } from "./MotionComponents";

const socialLinks = [
  {
    name: "GitHub",
    username: "@Keenanputra",
    href: "https://github.com/Keenanputra",
  },
  {
    name: "Instagram",
    username: "@keenandkiri",
    href: "https://www.instagram.com/keenandkiri/",
  },
  {
    name: "YouTube",
    username: "@keenanputra7251",
    href: "https://www.youtube.com/@keenanputra7251",
  },
  {
    name: "TikTok",
    username: "@kgynan",
    href: "https://www.tiktok.com/@kgynan",
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
          Ikuti sosial media saya untuk mengenal lebih dekat, dan mari berteman.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {socialLinks.map((social, i) => (
          <Reveal key={social.name} delay={i * 0.1}>
            <MotionA
              href={social.href}
              target="_blank"
              rel="noreferrer"
              className="liquid-glass-card group block p-6 text-center gpu-accelerated"
              whileHover={{ 
                scale: 1.01,
                filter: "brightness(1.05)",
                boxShadow: "0 15px 30px rgba(255,255,255,0.08)"
              }}
              whileTap={{ scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <MotionDiv 
                className="liquid-glass-icon-container"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 15px rgba(255,255,255,0.2)" 
                }}
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              >
                {social.name === "GitHub" && (
                  <svg className="h-6 w-6 text-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                )}
                {social.name === "Instagram" && (
                  <svg className="h-6 w-6 text-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                )}
                {social.name === "YouTube" && (
                  <svg className="h-6 w-6 text-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                )}
                {social.name === "TikTok" && (
                  <svg className="h-6 w-6 text-foreground" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.849-1.419-1.917-1.529-3.098h-.843c-.058 0-.114.004-.17.004H12V14.9c0 .367-.012.73-.036 1.086a3.84 3.84 0 0 1-3.8 3.263c-2.126 0-3.854-1.729-3.854-3.854 0-2.126 1.729-3.854 3.854-3.854.352 0 .69.05 1.011.14v-1.611a5.463 5.463 0 0 0-1.011-.093c-3.06 0-5.542 2.482-5.542 5.542 0 3.059 2.482 5.541 5.542 5.541 3.059 0 5.541-2.482 5.541-5.541V9.804a7.65 7.65 0 0 0 4.804 1.66V9.653c-1.126-.002-2.18-.396-3.018-1.027V5.562z"/>
                  </svg>
                )}
              </MotionDiv>
              <MotionH3 
                className="mt-4 text-lg font-semibold text-foreground"
                whileHover={{ color: "#ffffff" }}
                transition={{ duration: 0.2 }}
              >
                {social.name}
              </MotionH3>
              <MotionP 
                className="mt-1 text-sm text-muted"
                whileHover={{ color: "#d4d4d8" }}
                transition={{ duration: 0.2 }}
              >
                {social.username}
              </MotionP>
              <MotionDiv 
                className="mt-3 flex items-center justify-center text-xs font-medium text-muted"
                whileHover={{ color: "#ffffff" }}
                transition={{ duration: 0.2 }}
              >
                <span>Follow</span>
                <MotionSvg 
                  className="ml-1 h-3 w-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </MotionSvg>
              </MotionDiv>
            </MotionA>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
