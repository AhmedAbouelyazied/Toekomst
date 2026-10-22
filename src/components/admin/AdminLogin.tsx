"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { withBase } from "@/lib/base";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch(withBase("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(res.status === 401 ? "Ongeldige inloggegevens." : "Inloggen mislukt.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fout");
      setBusy(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-brand-soft bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <form onSubmit={onSubmit} className="mx-auto grid w-full max-w-sm gap-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-brand-dark" htmlFor="email">
          E-mail
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-brand-dark" htmlFor="password">
          Wachtwoord
        </label>
        <input id="password" name="password" type="password" required className={inputClass} />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
      >
        {busy ? "Bezig…" : "Inloggen"}
      </button>
    </form>
  );
}
