export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="space-y-2">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
      )}
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="max-w-xl text-muted-foreground">{subtitle}</p>}
    </header>
  );
}
