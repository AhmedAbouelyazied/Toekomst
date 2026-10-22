"use client";

import { useEffect, useMemo, useState } from "react";
import type { PrayerName, PrayerTimes as PrayerTimesData } from "@/lib/mawaqit";
import type { Dictionary } from "@/i18n/dictionaries";

const ORDER: { key: PrayerName | "shuruq"; labelKey: string }[] = [
  { key: "fajr", labelKey: "fajr" },
  { key: "shuruq", labelKey: "shuruq" },
  { key: "dhuhr", labelKey: "dhuhr" },
  { key: "asr", labelKey: "asr" },
  { key: "maghrib", labelKey: "maghrib" },
  { key: "isha", labelKey: "isha" },
];

function toDate(base: string, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(`${base}T00:00:00`);
  d.setHours(h, m, 0, 0);
  return d;
}

export function PrayerTimes({ data, dict }: { data: PrayerTimesData; dict: Dictionary }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const next = useMemo(() => {
    if (!now) return null;
    const candidates = (["fajr", "dhuhr", "asr", "maghrib", "isha"] as PrayerName[])
      .map((p) => ({ prayer: p, at: data.times[p].adhan }))
      .filter((c): c is { prayer: PrayerName; at: string } => Boolean(c.at))
      .map((c) => ({ ...c, date: toDate(data.date, c.at) }))
      .filter((c) => c.date.getTime() > now.getTime())
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    return candidates[0] ?? null;
  }, [now, data]);

  const label = (key: string) =>
    (dict.prayer as Record<string, string>)[key] ?? key;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-foreground/70">
        <span>
          <strong className="text-brand-dark">{dict.prayer.today}:</strong> {data.date}
        </span>
        {data.hijri && (
          <span>
            <strong className="text-brand-dark">{dict.prayer.hijri}:</strong> {data.hijri}
          </span>
        )}
      </div>

      {next && (
        <div className="mb-6 rounded-xl bg-brand-light px-4 py-3 text-brand-dark">
          <span className="text-sm font-medium">{dict.prayer.nextPrayer}: </span>
          <span className="font-semibold">{label(next.prayer)}</span>
          <span className="text-sm">
            {" — "}
            {data.times[next.prayer].adhan}
          </span>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-brand-soft">
        <table className="w-full text-left">
          <thead className="bg-brand-light text-brand-dark">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold"> </th>
              <th className="px-4 py-3 text-sm font-semibold">{dict.prayer.adhan}</th>
              <th className="px-4 py-3 text-sm font-semibold">{dict.prayer.iqama}</th>
            </tr>
          </thead>
          <tbody>
            {ORDER.map((row) => {
              const isNext = next?.prayer === row.key;
              const value =
                row.key === "shuruq"
                  ? { adhan: data.shuruq, iqama: null }
                  : data.times[row.key as PrayerName];
              return (
                <tr
                  key={row.key}
                  className={`border-t border-brand-soft/60 ${
                    isNext ? "bg-brand-light/60" : "odd:bg-white even:bg-brand-light/20"
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-brand-dark">{label(row.labelKey)}</td>
                  <td className="px-4 py-3 tabular-nums">{value.adhan ?? "—"}</td>
                  <td className="px-4 py-3 tabular-nums">{value.iqama ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-foreground/70">
        {data.jumua && (
          <span>
            <strong className="text-brand-dark">{dict.prayer.jumua}:</strong> {data.jumua}
            {data.jumua2 ? ` / ${data.jumua2}` : ""}
          </span>
        )}
        <a
          href={data.mosque.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand hover:underline"
        >
          {dict.prayer.viewOnMawaqit}
        </a>
      </div>
    </div>
  );
}
