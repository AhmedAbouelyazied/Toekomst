"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const rest = segments.slice(1);

  const hrefFor = (target: Locale) => "/" + [target, ...rest].join("/");

  return (
    <div className="flex items-center gap-1 rounded-lg border border-brand-soft p-0.5 text-xs font-semibold">
      {locales.map((l) => (
        <Link
          key={l}
          href={hrefFor(l)}
          aria-current={l === locale ? "true" : undefined}
          className={`rounded-md px-2 py-1 uppercase transition-colors ${
            l === locale
              ? "bg-brand text-white"
              : "text-brand-dark/70 hover:bg-brand-light"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}
