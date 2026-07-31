export type ContactInput = { name: string; email: string; message: string };
export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

export type ContactResult =
  | { ok: true; data: ContactInput }
  | { ok: false; errors: ContactErrors };

export function validateContact(input: Partial<ContactInput>): ContactResult {
  const errors: ContactErrors = {};
  const name = (input.name ?? "").trim();
  const email = (input.email ?? "").trim();
  const message = (input.message ?? "").trim();

  if (name.length < 2) errors.name = "Nama minimal 2 karakter.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Format email tidak valid.";
  if (message.length < 10) errors.message = "Pesan minimal 10 karakter.";

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, data: { name, email, message } };
}
