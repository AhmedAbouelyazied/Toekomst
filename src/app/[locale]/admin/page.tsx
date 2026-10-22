import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getSession } from "@/lib/auth";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const session = await getSession();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-bold text-brand-dark">Beheer — reserveringen</h1>
      {session ? <AdminDashboard /> : <AdminLogin />}
    </section>
  );
}
