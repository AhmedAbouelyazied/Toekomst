import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PrayerTimesLoader } from "@/components/PrayerTimesLoader";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const quick = [
    { href: `/${locale}/activiteiten`, label: dict.nav.activities },
    { href: `/${locale}/school`, label: dict.nav.school },
    { href: `/${locale}/reserveren`, label: dict.nav.booking },
    { href: `/${locale}/links`, label: dict.nav.links },
  ];

  return (
    <>
      <section className="brand-gradient text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h1 className="text-3xl font-bold leading-tight sm:text-5xl">
              {dict.home.heroTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90">{dict.home.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${locale}/gebedstijden`}
                className="rounded-lg bg-white px-6 py-3 font-semibold text-brand-dark shadow-sm transition hover:bg-brand-light"
              >
                {dict.home.heroCta}
              </Link>
              <Link
                href={`/${locale}/reserveren`}
                className="rounded-lg border border-white/70 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                {dict.home.heroCta2}
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/logo.jpg"
              alt="VZW De Toekomst"
              width={260}
              height={260}
              className="h-52 w-52 rounded-full bg-white object-cover shadow-xl sm:h-64 sm:w-64"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-brand-dark">{dict.home.missionTitle}</h2>
            <p className="mt-3 leading-relaxed text-foreground/75">{dict.home.missionText}</p>

            <h3 className="mt-8 text-lg font-semibold text-brand-dark">
              {dict.home.quickLinksTitle}
            </h3>
            <div className="mt-3 flex flex-wrap gap-3">
              {quick.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg border border-brand-soft bg-white px-4 py-2 text-sm font-medium text-brand-dark transition hover:bg-brand-light"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-soft bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-xl font-bold text-brand-dark">
              {dict.home.prayerTeaserTitle}
            </h2>
            <p className="mb-4 text-sm text-foreground/60">{dict.home.prayerTeaserText}</p>
            <PrayerTimesLoader dict={dict} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl bg-brand-dark px-6 py-10 text-center text-white sm:px-12">
          <h2 className="text-2xl font-bold sm:text-3xl">{dict.home.ctaTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/80">{dict.home.ctaText}</p>
          <Link
            href={`/${locale}/reserveren`}
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-brand-dark transition hover:bg-brand-light"
          >
            {dict.common.bookNow}
          </Link>
        </div>
      </section>
    </>
  );
}
