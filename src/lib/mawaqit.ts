import { mawaqit } from "./config";

export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export type PrayerTime = {
  adhan: string | null;
  iqama: string | null;
};

export type PrayerTimes = {
  mosque: {
    name: string;
    city: string;
    timezone: string;
    url: string;
  };
  date: string;
  hijri: string | null;
  times: Record<PrayerName, PrayerTime>;
  shuruq: string | null;
  imsak: string | null;
  jumua: string | null;
  jumua2: string | null;
  source: "mawaqit" | "fallback";
};

const PRAYER_ORDER: PrayerName[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

function normalizeTime(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 100);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }
  const str = String(value).trim();
  if (!str) return null;
  if (str.includes(":")) {
    const [h, m] = str.split(":");
    return `${h.padStart(2, "0")}:${(m ?? "00").padStart(2, "0")}`;
  }
  const num = Number(str);
  if (!Number.isNaN(num)) return normalizeTime(num);
  return str;
}

function addMinutes(time: string, minutes: number): string {
  const [h, m] = time.split(":").map(Number);
  const total = (h * 60 + m + minutes + 24 * 60) % (24 * 60);
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function resolveIqama(adhan: string | null, raw: unknown): string | null {
  if (adhan === null) return null;
  const str = raw === null || raw === undefined ? "" : String(raw).trim();
  if (!str) return null;
  if (str.startsWith("+") || str.startsWith("-")) {
    const minutes = parseInt(str, 10);
    if (Number.isNaN(minutes)) return null;
    return addMinutes(adhan, minutes);
  }
  return normalizeTime(raw);
}

function extractConfData(html: string): Record<string, unknown> | null {
  const marker = "confData";
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const braceStart = html.indexOf("{", start);
  if (braceStart === -1) return null;

  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = braceStart; i < html.length; i++) {
    const c = html[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        try {
          return JSON.parse(html.slice(braceStart, i + 1));
        } catch {
          return null;
        }
      }
    }
  }
  return null;
}

function hijriDate(timezone: string, adjustment: number, now: Date): string | null {
  try {
    const shifted = new Date(now.getTime() + adjustment * 24 * 60 * 60 * 1000);
    const formatter = new Intl.DateTimeFormat("en-TN-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: timezone,
    });
    return formatter.format(shifted);
  } catch {
    return null;
  }
}

function localParts(timezone: string, now: Date): { month: number; day: number; iso: string } {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const iso = fmt.format(now);
  const [year, month, day] = iso.split("-").map(Number);
  void year;
  return { month, day, iso };
}

export function parseConfData(
  conf: Record<string, unknown>,
  now: Date = new Date(),
): PrayerTimes {
  const timezone = typeof conf.timezone === "string" ? conf.timezone : "Europe/Brussels";
  const name = typeof conf.name === "string" ? conf.name : "De Toekomst";
  const city = typeof conf.city === "string" ? conf.city : "Gent";
  const { month, day, iso } = localParts(timezone, now);

  const rawTimes = Array.isArray(conf.times) ? conf.times : [];
  const adhans = PRAYER_ORDER.map((_, idx) => normalizeTime(rawTimes[idx]));

  const iqamaCalendar = Array.isArray(conf.iqamaCalendar) ? conf.iqamaCalendar : [];
  const monthIqama = iqamaCalendar[month - 1] as Record<string, unknown> | undefined;
  const dayIqama = monthIqama?.[String(day)];
  const rawIqamas = Array.isArray(dayIqama) ? dayIqama : [];

  const times = {} as Record<PrayerName, PrayerTime>;
  PRAYER_ORDER.forEach((name_, idx) => {
    times[name_] = {
      adhan: adhans[idx],
      iqama: resolveIqama(adhans[idx], rawIqamas[idx]),
    };
  });

  const adjustment = typeof conf.hijriAdjustment === "number" ? conf.hijriAdjustment : 0;
  const imsakOffset = typeof conf.imsakNbMinBeforeFajr === "number" ? conf.imsakNbMinBeforeFajr : 0;

  return {
    mosque: { name, city, timezone, url: mawaqit.url },
    date: iso,
    hijri: conf.hijriDateEnabled ? hijriDate(timezone, adjustment, now) : null,
    times,
    shuruq: normalizeTime(conf.shuruq),
    imsak: imsakOffset && adhans[0] ? addMinutes(adhans[0], -imsakOffset) : null,
    jumua: normalizeTime(conf.jumua),
    jumua2: normalizeTime(conf.jumua2),
    source: "mawaqit",
  };
}

let cache: { data: PrayerTimes; at: number } | null = null;
const CACHE_TTL = 60 * 60 * 1000;

export async function getPrayerTimes(force = false): Promise<PrayerTimes> {
  if (!force && cache && Date.now() - cache.at < CACHE_TTL) {
    return cache.data;
  }
  try {
    const res = await fetch(mawaqit.url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DeToekomstWebsite/1.0; +https://toekomst.be)",
        "Accept-Language": "en",
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Mawaqit responded ${res.status}`);
    const html = await res.text();
    const conf = extractConfData(html);
    if (!conf) throw new Error("confData not found");
    const data = parseConfData(conf);
    cache = { data, at: Date.now() };
    return data;
  } catch (err) {
    if (cache) return cache.data;
    throw err;
  }
}
