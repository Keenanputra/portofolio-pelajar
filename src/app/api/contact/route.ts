import { NextResponse } from "next/server";
import { validateContact } from "@/lib/validate";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validateContact(body ?? {});

  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  if (!process.env.FORMSPREE_FORM_ID) {
    return NextResponse.json(
      { ok: false, errors: { global: "Form kontak belum dikonfigurasi. Tambahkan FORMSPREE_FORM_ID." } },
      { status: 503 }
    );
  }

  const form = new URLSearchParams({
    name: result.data.name,
    email: result.data.email,
    message: result.data.message,
  });

  const res = await fetch(`https://formspree.io/f/${process.env.FORMSPREE_FORM_ID}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form.toString(),
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, errors: { global: "Gagal mengirim pesan. Silakan coba lagi." } },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
