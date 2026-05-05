"use client";

import { COUNTRIES, Country } from "@/lib/types";

type CountryFlagProps = {
  country: Country;
  className?: string;
};

export function CountryFlag({ country, className }: CountryFlagProps) {
  const info = COUNTRIES[country];
  return (
    <img
      src={`https://flagcdn.com/w40/${country.toLowerCase()}.png`}
      alt={`${info.name} flag`}
      className={className ?? "h-5 w-7 object-cover"}
      loading="lazy"
    />
  );
}
