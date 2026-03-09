import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid auto-rows-min grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6",
        className
      )}
    >
      {children}
    </div>
  );
}
