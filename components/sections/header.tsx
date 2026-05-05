"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Menu } from "lucide-react";

export interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-black/[0.08] bg-white/[0.97] shadow-[0_8px_40px_rgba(0,0,0,0.06)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
      <div className="mx-auto flex min-h-[5rem] max-w-[1480px] items-center justify-between gap-4 px-5 py-3 sm:min-h-[5.5rem] sm:px-8 sm:py-3.5">
        <a href="#" className="group flex min-w-0 items-center gap-3 sm:gap-5">
          <span className="relative grid h-[5.25rem] w-[5.25rem] shrink-0 place-items-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] sm:h-[6.25rem] sm:w-[6.25rem]">
            <img
              src="/images/logo.png"
              alt="Sonke logo"
              className="h-full w-full object-contain drop-shadow-sm"
            />
          </span>
          <span className="min-w-0 max-w-[9.5rem] sm:max-w-[11rem]">
            <span className="block text-[9px] font-black uppercase leading-snug tracking-[0.26em] text-primary sm:text-[11px] sm:tracking-[0.28em]">
              Real cost of life
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-1 text-[11px] font-bold uppercase tracking-[0.16em] text-foreground/80 md:flex">
          {(
            [
              ["#about", "About"],
              ["#services", "Costs"],
              ["#calculator", "Calculator"],
              ["#faq", "FAQ"],
            ] as const
          ).map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="rounded-full px-4 py-2.5 transition-colors hover:bg-secondary hover:text-primary"
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#calculator"
          className="hidden items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-background shadow-sm transition-colors hover:bg-primary sm:flex"
        >
          Calculate <ArrowUpRight className="h-4 w-4" />
        </a>
        <button
          type="button"
          aria-label="Open menu"
          onClick={onMenuClick}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-black/15 bg-white transition-colors hover:bg-secondary md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </motion.header>
  );
}