import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="breadcrumbs" className="flex items-center gap-1 text-2xs uppercase tracking-wider text-ink-mid">
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={`${item.label}-${idx}`} className="flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-ink-high">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-ink-high" : ""}>{item.label}</span>
            )}
            {!isLast ? <ChevronRight className="h-3 w-3 text-ink-low" /> : null}
          </span>
        );
      })}
    </nav>
  );
}
