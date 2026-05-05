import { NextResponse } from "next/server";
import { COUNTRIES, type Country } from "@/lib/types";

type KnowledgeRequest = {
  country: Country;
  monthlyIncome: number;
  totalExpenses: number;
  topCosts: Array<{ name: string; amount: number }>;
  refreshToken?: string;
};

function geminiModel() {
  return process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
}

export async function POST(request: Request) {
  const apiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;
  const body = (await request.json().catch(() => null)) as KnowledgeRequest | null;

  if (!body || !(body.country in COUNTRIES)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({
      source: "fallback",
      note: "Missing Gemini API key. Using offline insight rules.",
      updatedAt: Date.now(),
      highlights: [
        "High transport usually means location or trip planning is driving pressure.",
        "Digital costs compound quietly; audit subscriptions every month.",
        "If expenses exceed 85% of income, one structural change beats many tiny cuts.",
      ],
      actions: [
        "Set a 7-day no-spend challenge for non-essentials.",
        "Cancel one subscription for 30 days and review impact.",
        "Batch weekly trips to reduce transport leakage.",
      ],
    });
  }

  const country = COUNTRIES[body.country];
  const prompt = `
You are a practical financial researcher.
Generate concise, real-world monthly money insights and actions for someone in ${country.name}.
Use web knowledge for current context, but keep advice evergreen and actionable.

Context:
- Country: ${country.name}
- Currency: ${country.symbol}
- Monthly income: ${country.symbol}${body.monthlyIncome.toLocaleString()}
- Monthly expenses: ${country.symbol}${body.totalExpenses.toLocaleString()}
- Top cost buckets: ${body.topCosts.map((item) => `${item.name}: ${country.symbol}${item.amount.toLocaleString()}`).join(", ")}
- Refresh token: ${body.refreshToken ?? Date.now()}

Return ONLY valid JSON:
{
  "highlights": ["3 short one-line observations"],
  "actions": ["3 short one-line actions"]
}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel()}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "Return only valid JSON. No markdown." }],
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
          tools: [{ google_search: {} }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini request failed with ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    const parsed = JSON.parse(content) as { highlights?: string[]; actions?: string[] };

    return NextResponse.json({
      source: "ai",
      updatedAt: Date.now(),
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights.slice(0, 3) : [],
      actions: Array.isArray(parsed.actions) ? parsed.actions.slice(0, 3) : [],
    });
  } catch {
    return NextResponse.json({
      source: "fallback",
      note: "Gemini is currently unavailable or quota-limited. Showing offline insights.",
      updatedAt: Date.now(),
      highlights: [
        "Track your three biggest categories first; that is where meaningful savings happen.",
        "When income feels tight, fixed commitments usually need renegotiation first.",
        "A monthly review habit prevents silent budget drift.",
      ],
      actions: [
        "Set hard caps for food, transport, and subscriptions this month.",
        "Move savings right after payday before discretionary spending.",
        "Review recurring payments and remove one low-value service.",
      ],
    });
  }
}
