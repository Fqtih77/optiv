import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  showWordmark = true,
}: {
  className?: string;
  href?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-2.5 select-none", className)}
      aria-label="Optiv"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 group-hover:rotate-[12deg]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
          <circle cx="8" cy="13" r="4.2" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="16" cy="13" r="4.2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12.2 12.2c-.5-.6-1.9-.6-2.4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M3.8 12.4 6 8.6h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M20.2 12.4 18 8.6h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </span>
      {showWordmark && (
        <span className="display text-[20px] leading-none tracking-tight text-foreground">optiv</span>
      )}
    </Link>
  );
}
