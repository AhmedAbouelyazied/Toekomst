import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";
import { fatwaLinks, quranLinks, type LinkItem } from "@/lib/config";

function LinkGroup({
  title,
  intro,
  items,
  locale,
}: {
  title: string;
  intro: string;
  items: LinkItem[];
  locale: "nl" | "ar" | "en";
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-2xl font-bold text-brand-dark">{title}</h2>
      <p className="mt-2 text-foreground/70">{intro}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <a
            key={item.url}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col rounded-2xl border border-brand-soft bg-white p-5 shadow-sm transition hover:border-brand hover:shadow-md"
          >
            <span className="font-semibold text-brand-dark group-hover:text-brand">
              {item.name} ↗
            </span>
            <span className="mt-2 text-sm leading-relaxed text-foreground/70">
              {item.description[locale]}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default async function LinksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.links.title} intro={dict.links.intro} />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <LinkGroup
          title={dict.links.quranTitle}
          intro={dict.links.quranIntro}
          items={quranLinks}
          locale={locale}
        />
        <LinkGroup
          title={dict.links.fatwaTitle}
          intro={dict.links.fatwaIntro}
          items={fatwaLinks}
          locale={locale}
        />
      </div>
    </>
  );
}
