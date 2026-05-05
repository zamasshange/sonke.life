import { NextResponse } from "next/server";

function geminiModel() {
  return process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
}

function parseAdviceJson(content: string): string[] {
  const trimmed = content.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/);
  const raw = fence ? fence[1].trim() : trimmed;
  const parsed = JSON.parse(raw) as { advice?: unknown };
  const list = parsed.advice;
  if (!Array.isArray(list)) return [];
  return list.filter((item): item is string => typeof item === "string");
}

type CostItem = {
  name: string;
  amount: number;
};

type AdviceRequest = {
  countryName: string;
  currencySymbol: string;
  monthlyIncome: number;
  totalExpenses: number;
  difference: number;
  living: CostItem[];
  digital: CostItem[];
};

const getFallbackAdvice = (body: AdviceRequest) => {
  const allCosts = [...body.living, ...body.digital].sort((a, b) => b.amount - a.amount);
  const topCost = allCosts[0];
  const subscriptionCost = body.digital.find((item) => item.name === "Subscriptions")?.amount ?? 0;
  const transportCost = body.living.find((item) => item.name === "Transport")?.amount ?? 0;

  const advice = [
    `Your biggest cost is ${topCost.name} at ${body.currencySymbol}${topCost.amount.toLocaleString()}. Start there before cutting small items.`,
  ];

  if (subscriptionCost > body.totalExpenses * 0.05) {
    advice.push(`Pause one subscription for 30 days and keep only what you use weekly.`);
  }

  if (transportCost > body.totalExpenses * 0.12) {
    advice.push(`Transport is taking a noticeable share. Try batching trips or carpooling for one month.`);
  }

  if (body.difference < 0) {
    advice.push(`You need to close a gap of ${body.currencySymbol}${Math.abs(body.difference).toLocaleString()} per month. Combine one cost cut with one small income move.`);
  } else {
    advice.push(`You have ${body.currencySymbol}${body.difference.toLocaleString()} left. Move a fixed part of that into savings before spending.`);
  }

  return advice.slice(0, 4);
};

export async function POST(request: Request) {
  const body = (await request.json()) as AdviceRequest;
  const geminiApiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return NextResponse.json({
      source: "fallback",
      advice: getFallbackAdvice(body),
      note: "Add GOOGLE_API_KEY to the project-root .env.local to enable AI advice.",
    });
  }

  const prompt = `
You are Sonke, a practical budgeting assistant for everyday people.
Give 4 short, specific budgeting recommendations. Be direct, kind, and realistic.
Do not mention that you are an AI. Do not give investment or legal advice.

Country: ${body.countryName}
Monthly income: ${body.currencySymbol}${body.monthlyIncome.toLocaleString()}
Total expenses: ${body.currencySymbol}${body.totalExpenses.toLocaleString()}
Difference: ${body.currencySymbol}${body.difference.toLocaleString()}
Living costs: ${body.living.map((item) => `${item.name}: ${body.currencySymbol}${item.amount}`).join(", ")}
Digital costs: ${body.digital.map((item) => `${item.name}: ${body.currencySymbol}${item.amount}`).join(", ")}

Return only this JSON shape: {"advice":["short recommendation","short recommendation","short recommendation","short recommendation"]}.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel()}:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: "You write concise, localized budgeting advice. Return only valid JSON." }],
          },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.35,
            responseMimeType: "application/json",
          },
          tools: [{ google_search: {} }],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      if (process.env.NODE_ENV === "development") {
        console.error("[ai-advice] Gemini error:", response.status, errText.slice(0, 500));
      }
      if (response.status === 429) {
        return NextResponse.json({
          source: "fallback",
          advice: getFallbackAdvice(body),
          note: "Gemini quota is exhausted on this API key right now, so Sonke is using offline rules.",
        });
      }
      throw new Error(`Gemini request failed with ${response.status}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

    let advice: string[] = [];
    try {
      advice = parseAdviceJson(content);
    } catch {
      try {
        const parsed = JSON.parse(content) as { advice?: string[] } | string[];
        advice = Array.isArray(parsed) ? parsed : parsed.advice ?? [];
      } catch {
        advice = [];
      }
    }

    if (advice.length === 0) {
      return NextResponse.json({
        source: "fallback",
        advice: getFallbackAdvice(body),
        note: "The model response was not valid JSON, so Sonke used local budgeting rules.",
      });
    }

    return NextResponse.json({
      source: "ai",
      advice: advice.slice(0, 4),
    });
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[ai-advice]", e);
    }
    return NextResponse.json({
      source: "fallback",
      advice: getFallbackAdvice(body),
      note: "AI advice could not be generated, so Sonke used local budgeting rules.",
    });
  }
}
