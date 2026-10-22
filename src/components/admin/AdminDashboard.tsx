"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { withBase } from "@/lib/base";
import { bookingTypes, halls } from "@/lib/config";

type Booking = {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  startTime: string;
  endTime: string | null;
  hall: string;
  guests: number;
  message: string | null;
  status: string;
  locale: string;
  createdAt: string;
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "In afwachting",
  CONFIRMED: "Bevestigd",
  DECLINED: "Geweigerd",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  DECLINED: "bg-red-100 text-red-700",
};

function label(list: { id: string; label: { nl: string } }[], id: string) {
  return list.find((x) => x.id === id)?.label.nl ?? id;
}

export function AdminDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(withBase(`/api/bookings?status=${filter}`));
    if (res.status === 401) {
      router.refresh();
      return;
    }
    const json = await res.json();
    setBookings(json.bookings ?? []);
    setLoading(false);
  }, [filter, router]);

  useEffect(() => {
    const id = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(id);
  }, [load]);

  async function setStatus(id: string, status: string) {
    await fetch(withBase(`/api/bookings/${id}`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm("Deze aanvraag verwijderen?")) return;
    await fetch(withBase(`/api/bookings/${id}`), { method: "DELETE" });
    load();
  }

  async function logout() {
    await fetch(withBase("/api/admin/logout"), { method: "POST" });
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-brand-soft bg-white px-3 py-2 text-sm"
        >
          <option value="ALL">Alle</option>
          <option value="PENDING">In afwachting</option>
          <option value="CONFIRMED">Bevestigd</option>
          <option value="DECLINED">Geweigerd</option>
        </select>
        <a
          href={withBase("/api/admin/export")}
          className="rounded-lg border border-brand-soft bg-white px-3 py-2 text-sm font-medium text-brand-dark hover:bg-brand-light"
        >
          Export CSV
        </a>
        <button
          type="button"
          onClick={logout}
          className="ml-auto rounded-lg border border-brand-soft px-3 py-2 text-sm font-medium text-brand-dark hover:bg-brand-light"
        >
          Uitloggen
        </button>
      </div>

      {loading ? (
        <p className="text-foreground/60">Laden…</p>
      ) : bookings.length === 0 ? (
        <p className="rounded-xl border border-brand-soft bg-white p-6 text-foreground/60">
          Geen aanvragen.
        </p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-xl border border-brand-soft bg-white p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[b.status]}`}>
                  {STATUS_LABEL[b.status] ?? b.status}
                </span>
                <span className="font-semibold text-brand-dark">{label(bookingTypes, b.type)}</span>
                <span className="text-sm text-foreground/60">{b.date} · {b.startTime}{b.endTime ? `–${b.endTime}` : ""}</span>
                <span className="text-sm text-foreground/60">· {label(halls, b.hall)} · {b.guests} pers.</span>
                <span className="ml-auto text-xs text-foreground/40">
                  {new Date(b.createdAt).toLocaleString("nl-BE")}
                </span>
              </div>

              <div className="mt-3 grid gap-1 text-sm text-foreground/80 sm:grid-cols-2">
                <span><strong>{b.name}</strong></span>
                <span>{b.email} · {b.phone}</span>
              </div>
              {b.message && (
                <p className="mt-2 rounded-lg bg-brand-light/40 px-3 py-2 text-sm text-foreground/70">
                  {b.message}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {b.status !== "CONFIRMED" && (
                  <button
                    type="button"
                    onClick={() => setStatus(b.id, "CONFIRMED")}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    Bevestigen
                  </button>
                )}
                {b.status !== "DECLINED" && (
                  <button
                    type="button"
                    onClick={() => setStatus(b.id, "DECLINED")}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Weigeren
                  </button>
                )}
                <a
                  href={`mailto:${b.email}`}
                  className="rounded-lg border border-brand-soft px-4 py-2 text-sm font-medium text-brand-dark hover:bg-brand-light"
                >
                  E-mail
                </a>
                <button
                  type="button"
                  onClick={() => remove(b.id)}
                  className="ml-auto rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Verwijderen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
