import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";

export default async function ActivitiesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.activities.title} intro={dict.activities.intro} />
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dict.activities.items.map((item) => (
            <article
              key={item.title}
              className="flex flex-col rounded-2xl border border-brand-soft bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <span className="mb-2 inline-block w-fit rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-dark">
                {item.when}
              </span>
              <h2 className="text-lg font-semibold text-brand-dark">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
