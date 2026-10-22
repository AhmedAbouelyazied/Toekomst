"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    { key: "home", href: `/${locale}`, label: dict.nav.home },
    { key: "activities", href: `/${locale}/activiteiten`, label: dict.nav.activities },
    { key: "prayer", href: `/${locale}/gebedstijden`, label: dict.nav.prayer },
    { key: "school", href: `/${locale}/school`, label: dict.nav.school },
    { key: "booking", href: `/${locale}/reserveren`, label: dict.nav.booking },
    { key: "rules", href: `/${locale}/regels`, label: dict.nav.rules },
    { key: "links", href: `/${locale}/links`, label: dict.nav.links },
    { key: "contact", href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-soft/60 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="VZW De Toekomst"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
            priority
          />
          <span className="hidden text-lg font-semibold text-brand-dark sm:block">
            De Toekomst
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? "bg-brand-light text-brand-dark"
                  : "text-foreground/70 hover:bg-brand-light hover:text-brand-dark"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="rounded-lg border border-brand-soft p-2 text-brand-dark lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-brand-soft/60 bg-white lg:hidden">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3">
            {items.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(item.href)
                    ? "bg-brand-light text-brand-dark"
                    : "text-foreground/70 hover:bg-brand-light"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
