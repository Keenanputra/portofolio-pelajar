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
    <section id="kontak" className="mx-auto max-w-xl px-4 py-24">
      <Reveal>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          <span className="font-mono text-muted">04.</span> Hubungi Saya
        </h2>
        <p className="mt-3 text-muted">
          Punya pertanyaan, ide kolaborasi, atau sekadar menyapa? Kirim pesan lewat form ini.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <form onSubmit={handleSubmit} noValidate className="mt-10 space-y-5">
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
              className="w-full rounded-2xl border border-line bg-glass px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-1 focus:ring-accent backdrop-blur-xl"
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
              className="w-full rounded-2xl border border-line bg-glass px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-1 focus:ring-accent backdrop-blur-xl"
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
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full resize-y rounded-2xl border border-line bg-glass px-4 py-3 text-foreground outline-none transition focus:border-accent focus:ring-1 focus:ring-accent backdrop-blur-xl"
            />
            {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message}</p>}
          </div>

          {status === "sent" && (
            <p className="rounded-2xl border border-accent/40 bg-glass px-4 py-3 text-sm text-foreground backdrop-blur-xl">
              Pesan berhasil dikirim. Terima kasih!
            </p>
          )}
          {status === "error" && errors.global && (
            <p className="rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-400">
              {errors.global}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full rounded-2xl bg-foreground px-6 py-3 font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "sending" ? "Mengirim..." : "Kirim Pesan"}
          </button>
        </form>
      </Reveal>
    </section>
  );
}
