import { NextResponse } from "next/server";
import { COUNTRIES, type Country } from "@/lib/types";

type Profile = {
  id: string;
  title: string;
  monthlyRange: { min: number; max: number };
  notes: string[];
};

const fallbackProfilesZA = (): Array<Omit<Profile, "monthlyRange"> & { monthlyRangeZar: { min: number; max: number } }> => [
  {
    id: "student",
    title: "Student mode (shared housing)",
    monthlyRangeZar: { min: 4000, max: 7000 },
    notes: [
      "Keep rent and food stable first.",
      "Use free tools and student discounts.",
      "Side income is usually small at the start.",
    ],
  },
  {
    id: "remote",
    title: "Remote worker (SA)",
    monthlyRangeZar: { min: 7000, max: 15000 },
    notes: [
      "Internet is not optional—budget for stability.",
      "Watch tool + subscription creep.",
      "Aim for predictable monthly income.",
    ],
  },
  {
    id: "freelance",
    title: "Freelance studio",
    monthlyRangeZar: { min: 8000, max: 18000 },
    notes: [
      "Income is uneven—keep a buffer.",
      "Pick one core tool stack; avoid duplicates.",
      "Market every week, not only when dry.",
    ],
  },
  {
    id: "first_apartment",
    title: "First apartment (solo)",
    monthlyRangeZar: { min: 8000, max: 14000 },
    notes: [
      "Expect hidden costs: deposit, electricity spikes, basic furniture.",
      "Avoid rent that eats your whole income.",
      "Keep at least 1 small emergency buffer.",
    ],
  },
];

const convertFromZA = (amountZar: number, country: Country) => {
  const base = COUNTRIES.ZA.multiplier;
  const to = COUNTRIES[country].multiplier;
  return Math.round((amountZar / base) * to);
};

export async function POST(request: Request) {
  const apiKey = process.env.GROQ_API_KEY ?? process.env.AI_API_KEY;
  const body = (await request.json().catch(() => ({}))) as { country?: Country };
  const country: Country = body.country && body.country in COUNTRIES ? body.country : "ZA";
  const countryInfo = COUNTRIES[country];

  if (!apiKey) {
    const profiles: Profile[] = fallbackProfilesZA().map((p) => ({
      id: p.id,
      title: p.title,
      monthlyRange: {
        min: convertFromZA(p.monthlyRangeZar.min, country),
        max: convertFromZA(p.monthlyRangeZar.max, country),
      },
      notes: p.notes,
    }));
    return NextResponse.json({ source: "fallback", country, profiles });
  }

  const prompt = `
You are Sonke: practical “cost of living + digital life” assistant.
Return 4 cost profiles as JSON only.
Be realistic, South Africa-first tone (no hype). Keep notes practical.

Country: ${countryInfo.name}
Currency: ${countryInfo.currency} (${countryInfo.symbol})

Profiles (must include these ids): student, remote, freelance, first_apartment.

For each profile return:
- title: short label
- monthlyRange: {min, max} as numbers in the country currency (monthly totals)
- notes: 3 short bullets (plain strings)

Return ONLY JSON:
{"profiles":[{"id":"student","title":"...","monthlyRange":{"min":0,"max":0},"notes":["..."]}, ...]}
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Return only valid JSON. No markdown." },
          { role: "user", content: prompt },
        ],
        temperature: 0.35,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as { profiles?: Profile[] };
    const profiles = Array.isArray(parsed.profiles) ? parsed.profiles : [];

    if (profiles.length === 0) {
      throw new Error("No profiles returned");
    }

    return NextResponse.json({ source: "ai", country, profiles });
  } catch {
    const profiles: Profile[] = fallbackProfilesZA().map((p) => ({
      id: p.id,
      title: p.title,
      monthlyRange: {
        min: convertFromZA(p.monthlyRangeZar.min, country),
        max: convertFromZA(p.monthlyRangeZar.max, country),
      },
      notes: p.notes,
    }));
    return NextResponse.json({ source: "fallback", country, profiles });
  }
}

