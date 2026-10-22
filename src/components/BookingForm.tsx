"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { bookingTypes, halls } from "@/lib/config";
import { withBase } from "@/lib/base";

type Status = "idle" | "sending" | "success" | "error";

export function BookingForm({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    setMessage("");

    const data = Object.fromEntries(new FormData(form).entries());
    const payload = { ...data, consent: true, locale };

    try {
      const res = await fetch(withBase("/api/bookings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "failed");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-soft bg-brand-light p-8 text-center">
        <h3 className="text-xl font-semibold text-brand-dark">{dict.booking.success}</h3>
        <p className="mt-2 text-foreground/70">{dict.booking.successText}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-lg bg-brand px-5 py-2 font-medium text-white hover:bg-brand-dark"
        >
          {dict.common.submit}
        </button>
      </div>
    );
  }

  const labelClass = "mb-1 block text-sm font-medium text-brand-dark";
  const inputClass =
    "w-full rounded-lg border border-brand-soft bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="type">
          {dict.booking.type}
        </label>
        <select id="type" name="type" required className={inputClass} defaultValue="">
          <option value="" disabled>
            {dict.booking.selectPlaceholder}
          </option>
          {bookingTypes.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label[locale]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="name">
          {dict.booking.name}
        </label>
        <input id="name" name="name" required minLength={2} className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="phone">
          {dict.booking.phone}
        </label>
        <input id="phone" name="phone" required className={inputClass} />
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="email">
          {dict.booking.email}
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>

      <div>
        <label className={labelClass} htmlFor="date">
          {dict.booking.date}
        </label>
        <input id="date" name="date" type="date" required className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass} htmlFor="startTime">
            {dict.booking.startTime}
          </label>
          <input id="startTime" name="startTime" type="time" required className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="endTime">
            {dict.booking.endTime}
          </label>
          <input id="endTime" name="endTime" type="time" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="hall">
          {dict.booking.hall}
        </label>
        <select id="hall" name="hall" required className={inputClass} defaultValue="">
          <option value="" disabled>
            {dict.booking.selectPlaceholder}
          </option>
          {halls.map((h) => (
            <option key={h.id} value={h.id}>
              {h.label[locale]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass} htmlFor="guests">
          {dict.booking.guests}
        </label>
        <input
          id="guests"
          name="guests"
          type="number"
          min={1}
          max={5000}
          required
          className={inputClass}
        />
      </div>

      <div className="sm:col-span-2">
        <label className={labelClass} htmlFor="message">
          {dict.booking.message}
        </label>
        <textarea id="message" name="message" rows={4} className={inputClass} />
      </div>

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <label className="flex items-start gap-2 text-sm text-foreground/80 sm:col-span-2">
        <input type="checkbox" name="consentCheck" required className="mt-1" />
        {dict.booking.consent}
      </label>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">
          {dict.booking.error}
          {message ? ` (${message})` : ""}
        </p>
      )}

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
        >
          {status === "sending" ? dict.booking.sending : dict.booking.submit}
        </button>
      </div>
    </form>
  );
}
