import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";

export default async function RulesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.rules.title} intro={dict.rules.intro} />
      <section className="mx-auto max-w-4xl px-4 py-12">
        <ol className="space-y-3">
          {dict.rules.items.map((rule, index) => (
            <li
              key={rule}
              className="flex items-start gap-4 rounded-xl border border-brand-soft bg-white p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                {index + 1}
              </span>
              <span className="text-foreground/80">{rule}</span>
            </li>
          ))}
        </ol>
        <p className="mt-6 rounded-xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark">
          {dict.rules.note}
        </p>
      </section>
    </>
  );
}
