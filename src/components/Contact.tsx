"use client";
import { useState, type FormEvent } from "react";
import { MotionDiv, MotionButton } from "./MotionComponents";
import type { ContactErrors } from "@/lib/validate";
import Reveal from "./Reveal";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<ContactErrors & { global?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrors({});

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      errors?: ContactErrors & { global?: string };
    };

    if (!res.ok) {
      setErrors(data.errors ?? { global: "Gagal mengirim pesan. Coba lagi." });
      setStatus("error");
      return;
    }

    setStatus("sent");
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <section id="kontak" className="mx-auto max-w-lg px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-muted">04.</span> Hubungi Saya
        </h2>
        <p className="mt-3 text-muted">
          Punya pertanyaan, ide kolaborasi, atau sekadar menyapa?
        </p>
      </Reveal>

        <MotionDiv 
          className="mt-8 liquid-glass-card p-6 sm:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="nama" className="mb-1 block text-sm text-neutral-300">
                Nama
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full liquid-glass-form px-3 py-2.5 text-foreground outline-none transition-all duration-300 focus:border-white/40 focus:ring-1 focus:ring-white/20 placeholder:text-neutral-500"
                placeholder="Nama kamu"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-neutral-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full liquid-glass-form px-3 py-2.5 text-foreground outline-none transition-all duration-300 focus:border-white/40 focus:ring-1 focus:ring-white/20 placeholder:text-neutral-500"
                placeholder="email@contoh.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="pesan" className="mb-1 block text-sm text-neutral-300">
                Pesan
              </label>
              <textarea
                id="pesan"
                name="pesan"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-y liquid-glass-form px-3 py-2.5 text-foreground outline-none transition-all duration-300 focus:border-white/40 focus:ring-1 focus:ring-white/20 placeholder:text-neutral-500"
                placeholder="Tulis pesan kamu di sini..."
              />
              {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
            </div>

            {status === "sent" && (
              <p className="rounded-xl border border-white/30 bg-white/10 px-3 py-2.5 text-xs text-white animate-pulse">
                Pesan berhasil dikirim. Terima kasih!
              </p>
            )}
            {status === "error" && errors.global && (
              <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2.5 text-xs text-red-400">
                {errors.global}
              </p>
            )}

            <MotionButton
              type="submit"
              disabled={status === "sending"}
              className="w-full liquid-glass-accent px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-50 gpu-accelerated"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              {status === "sending" ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Mengirim...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Kirim Pesan
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </MotionButton>
          </form>
        </MotionDiv>
    </section>
  );
}
