import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";
import { org } from "@/lib/config";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const rows = [
    {
      label: dict.contact.address,
      value: `${org.address.street}, ${org.address.postalCode} ${org.address.city}, ${org.address.country}`,
    },
    { label: dict.contact.phone, value: org.phone, href: `tel:${org.phone.replace(/\s/g, "")}` },
    { label: dict.contact.email, value: org.email, href: `mailto:${org.email}` },
    { label: dict.contact.iban, value: org.iban },
    { label: dict.contact.hours, value: dict.contact.hoursValue },
  ];

  return (
    <>
      <PageHeader title={dict.contact.title} intro={dict.contact.intro} />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            {rows.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-brand-soft bg-white p-4"
              >
                <dt className="text-xs font-semibold uppercase tracking-wide text-brand">
                  {row.label}
                </dt>
                <dd className="mt-1 text-foreground/80">
                  {row.href ? (
                    <a href={row.href} className="hover:text-brand hover:underline">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
            <a
              href={org.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-medium text-brand hover:underline"
            >
              {dict.contact.facebook} ↗
            </a>
          </div>

          <div className="space-y-4">
            <a
              href={org.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-2xl border border-brand-soft bg-brand-light/40 p-6 font-medium text-brand-dark hover:bg-brand-light"
            >
              {dict.contact.map} ↗
            </a>
            <div className="rounded-2xl border border-brand-soft bg-brand-dark p-6 text-white">
              <h2 className="text-lg font-semibold">{dict.contact.sponsorTitle}</h2>
              <p className="mt-2 text-sm text-white/80">{dict.contact.sponsorText}</p>
              <p className="mt-3 text-sm font-medium">{dict.contact.iban}: {org.iban}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
