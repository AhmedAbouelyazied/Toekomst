import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { PageHeader } from "@/components/PageHeader";

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeader title={dict.school.title} intro={dict.school.intro} />
      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-4 text-xl font-bold text-brand-dark">{dict.school.classesTitle}</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {dict.school.classes.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-brand-soft bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-brand-dark">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/70">{item.desc}</p>
            </article>
          ))}
        </div>

        <h2 className="mb-4 mt-12 text-xl font-bold text-brand-dark">
          {dict.school.scheduleTitle}
        </h2>
        <div className="overflow-hidden rounded-2xl border border-brand-soft">
          <table className="w-full text-left">
            <thead className="bg-brand-light text-brand-dark">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold">{dict.school.day}</th>
                <th className="px-4 py-3 text-sm font-semibold">{dict.school.time}</th>
                <th className="px-4 py-3 text-sm font-semibold">{dict.school.group}</th>
              </tr>
            </thead>
            <tbody>
              {dict.school.schedule.map((row) => (
                <tr key={`${row.day}-${row.time}`} className="border-t border-brand-soft/60 odd:bg-white even:bg-brand-light/20">
                  <td className="px-4 py-3 font-medium text-brand-dark">{row.day}</td>
                  <td className="px-4 py-3 tabular-nums text-foreground/80">{row.time}</td>
                  <td className="px-4 py-3 text-foreground/70">{row.group}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 rounded-xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark">
          {dict.school.registerNote}
        </p>
      </section>
    </>
  );
}
