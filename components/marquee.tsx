"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  className?: string;
  reverse?: boolean;
  separator?: string;
}

export function Marquee({ items, className, reverse = false, separator = "•" }: MarqueeProps) {
  const content = items.join(` ${separator} `) + ` ${separator} `;
  
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div className={cn(
        "inline-flex",
        reverse ? "animate-marquee-reverse" : "animate-marquee"
      )}>
        <span className="inline-block">{content}</span>
        <span className="inline-block">{content}</span>
      </div>
    </div>
  );
}
