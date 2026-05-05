"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Country, COUNTRIES } from "@/lib/types";

const FEATURED_COUNTRY_CODES: Country[] = ["ZA", "US", "GB", "NG"];

export interface FooterSectionProps {
  countries?: Country[];
}

export function FooterSection({ countries = FEATURED_COUNTRY_CODES }: FooterSectionProps) {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      <div className="mx-auto max-w-[1480px] px-5 py-14 sm:px-8 sm:py-18">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <img
              src="/images/favicon.png"
              alt="Sonke mark"
              className="mb-6 h-28 w-28 object-contain sm:h-36 sm:w-36 lg:h-44 lg:w-44"
            />
            <h2 className="text-6xl font-black uppercase leading-[0.82] tracking-normal sm:text-8xl lg:text-9xl">
              Sonke.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/60">
              A financial mirror for real life: income, rent, groceries, transport, data,
              subscriptions, tools, and the choices that shape the month.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="border border-white/10 bg-white/[0.04] p-5">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-primary">
                Navigate
              </p>
              <div className="space-y-3 text-sm font-bold uppercase text-white/60">
                <a href="#about" className="block hover:text-primary">
                  About us
                </a>
                <a href="#services" className="block hover:text-primary">
                  Costs
                </a>
                <a href="#calculator" className="block hover:text-primary">
                  Calculator
                </a>
                <a href="#faq" className="block hover:text-primary">
                  FAQ
                </a>
              </div>
            </div>
            <div className="border border-white/10 bg-primary p-5 text-white">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.24em] text-white/70">
                Contact
              </p>
              <a
                href="mailto:sonkebusiness@gmail.com"
                className="break-words text-lg font-black hover:underline"
              >
                sonkebusiness@gmail.com
              </a>
              <p className="mt-5 text-sm text-white/75">Available worldwide</p>
              <p className="mt-1 text-sm text-white/75">Mo-Fr / 9am-6pm</p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs font-bold uppercase tracking-[0.18em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>sonke.life</p>
          <p>Budget mirror, not bank advice</p>
        </div>
      </div>
    </footer>
  );
}