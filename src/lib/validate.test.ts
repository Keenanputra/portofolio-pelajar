import { describe, expect, it } from "vitest";
import { validateContact } from "./validate";

describe("validateContact", () => {
  it("menerima input yang valid", () => {
    const result = validateContact({ name: "Keenan", email: "keenan13oc@gmail.com", message: "Halo, saya tertarik dengan portofolio ini." });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual({
        name: "Keenan",
        email: "keenan13oc@gmail.com",
        message: "Halo, saya tertarik dengan portofolio ini.",
      });
    }
  });

  it("menolak nama kosong", () => {
    const result = validateContact({ name: "", email: "a@b.co", message: "Halo halo halo" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.name).toBeDefined();
  });

  it("menolak email tidak valid", () => {
    const result = validateContact({ name: "Keenan", email: "bukan-email", message: "Halo halo halo" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.email).toBeDefined();
  });

  it("menolak pesan terlalu pendek", () => {
    const result = validateContact({ name: "Keenan", email: "a@b.co", message: "singkat" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.message).toBeDefined();
  });
});
