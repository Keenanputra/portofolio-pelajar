"use client";
import { useState, type FormEvent } from "react";
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
    <section id="kontak" className="mx-auto max-w-lg px-4 py-16">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-muted">04.</span> Hubungi Saya
        </h2>
        <p className="mt-3 text-muted">
          Punya pertanyaan, ide kolaborasi, atau sekadar menyapa?
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 rounded-2xl border border-line bg-glass p-6 backdrop-blur-xl">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label htmlFor="nama" className="mb-1 block text-sm text-foreground">
                Nama
              </label>
              <input
                id="nama"
                name="nama"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-line bg-background px-3 py-2 text-foreground outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm text-foreground">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-line bg-background px-3 py-2 text-foreground outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="pesan" className="mb-1 block text-sm text-foreground">
                Pesan
              </label>
              <textarea
                id="pesan"
                name="pesan"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full resize-y rounded-lg border border-line bg-background px-3 py-2 text-foreground outline-none transition focus:border-foreground focus:ring-1 focus:ring-foreground"
              />
              {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
            </div>

            {status === "sent" && (
              <p className="rounded-lg border border-foreground/30 bg-foreground/10 px-3 py-2 text-xs text-foreground">
                Pesan berhasil dikirim. Terima kasih!
              </p>
            )}
            {status === "error" && errors.global && (
              <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-400">
                {errors.global}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "sending" ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );
}
