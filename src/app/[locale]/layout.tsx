import type { Metadata } from "next";
import { Inter, Noto_Naskh_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { dir, isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const latin = Inter({ subsets: ["latin"], variable: "--font-latin", display: "swap" });
const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-naskh",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ghiras.be"),
  title: {
    default: "VZW De Toekomst — Islamitisch centrum Gent",
    template: "%s · VZW De Toekomst",
  },
  description:
    "Islamitisch centrum en moskee in Gent: gebedstijden, activiteiten, school en zaalverhuur.",
  icons: { icon: "/logo.jpg", apple: "/logo.jpg" },
  openGraph: {
    title: "VZW De Toekomst — Islamitisch centrum Gent",
    description: "Gebed, kennis en gemeenschap in Gent.",
    images: ["/logo.jpg"],
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${latin.variable} ${arabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header locale={locale} dict={dict} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
