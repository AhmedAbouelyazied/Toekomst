export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <section className="brand-gradient text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {intro && <p className="mt-3 max-w-3xl text-white/90">{intro}</p>}
      </div>
    </section>
  );
}
