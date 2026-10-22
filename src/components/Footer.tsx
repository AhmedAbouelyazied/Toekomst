import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { org } from "@/lib/config";
import { Logo } from "./Logo";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();

  const nav = [
    { href: `/${locale}/activiteiten`, label: dict.nav.activities },
    { href: `/${locale}/gebedstijden`, label: dict.nav.prayer },
    { href: `/${locale}/school`, label: dict.nav.school },
    { href: `/${locale}/reserveren`, label: dict.nav.booking },
    { href: `/${locale}/regels`, label: dict.nav.rules },
    { href: `/${locale}/links`, label: dict.nav.links },
    { href: `/${locale}/contact`, label: dict.nav.contact },
  ];

  return (
    <footer className="mt-16 border-t border-brand-soft bg-brand-dark text-white/90">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={48} className="h-12 w-12" />
            <div>
              <p className="font-semibold text-white">{org.name.nl}</p>
              <p className="text-sm text-white/70">{org.tagline.nl}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70">{dict.footer.sponsorNote}</p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            {dict.footer.quickLinks}
          </h3>
          <ul className="grid grid-cols-2 gap-1 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/70 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white">
            {dict.footer.contact}
          </h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>
              {org.address.street}, {org.address.postalCode} {org.address.city}
            </li>
            <li>
              <a href={`tel:${org.phone.replace(/\s/g, "")}`} className="hover:text-white">
                {org.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${org.email}`} className="hover:text-white">
                {org.email}
              </a>
            </li>
            <li>
              <a
                href={org.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        © {year} {org.name.nl} — {dict.common.allRightsReserved}
      </div>
    </footer>
  );
}
