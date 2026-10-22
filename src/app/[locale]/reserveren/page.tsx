import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";
import { BookingForm } from "@/components/BookingForm";
import { org } from "@/lib/config";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.booking.title} intro={dict.booking.intro} />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-2xl border border-brand-soft bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-brand-dark">{dict.booking.formTitle}</h2>
            <BookingForm locale={locale} dict={dict} />
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-brand-soft bg-brand-light/50 p-6">
              <h3 className="font-semibold text-brand-dark">{dict.contact.phone}</h3>
              <p className="mt-1 text-sm text-foreground/70">{org.phone}</p>
              <h3 className="mt-4 font-semibold text-brand-dark">{dict.contact.email}</h3>
              <p className="mt-1 text-sm text-foreground/70">{org.email}</p>
            </div>
            <div className="rounded-2xl border border-brand-soft bg-white p-6">
              <h3 className="font-semibold text-brand-dark">{dict.contact.address}</h3>
              <p className="mt-1 text-sm text-foreground/70">
                {org.address.street}
                <br />
                {org.address.postalCode} {org.address.city}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
