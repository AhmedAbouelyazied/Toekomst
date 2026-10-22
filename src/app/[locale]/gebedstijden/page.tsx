import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";
import { PrayerTimesLoader } from "@/components/PrayerTimesLoader";

export default async function PrayerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.prayer.title} intro={dict.prayer.intro} />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-2xl border border-brand-soft bg-white p-6 shadow-sm sm:p-8">
          <PrayerTimesLoader dict={dict} />
        </div>
      </section>
    </>
  );
}
