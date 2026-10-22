"use client";

import { useEffect, useState } from "react";
import type { PrayerTimes as PrayerTimesData } from "@/lib/mawaqit";
import type { Dictionary } from "@/i18n/dictionaries";
import { withBase } from "@/lib/base";
import { PrayerTimes } from "./PrayerTimes";
import { mawaqit } from "@/lib/config";

export function PrayerTimesLoader({ dict }: { dict: Dictionary }) {
  const [data, setData] = useState<PrayerTimesData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(withBase("/api/prayer-times"))
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => active && setData(json))
      .catch(() => active && setError(true));
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-brand-soft bg-white p-6">
        <p className="text-foreground/70">{dict.prayer.error}</p>
        <a
          href={withBase(mawaqit.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-medium text-brand hover:underline"
        >
          {dict.prayer.viewOnMawaqit}
        </a>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-brand-soft bg-white p-6 text-foreground/60">
        {dict.prayer.loading}
      </div>
    );
  }

  return <PrayerTimes data={data} dict={dict} />;
}
