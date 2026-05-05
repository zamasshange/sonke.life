import { NextResponse } from "next/server";
import { SONKE_SYSTEM_PROMPT, sonkeChatFallback, type SonkeChatContext } from "@/lib/sonke-chat-fallback";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatRequest = {
  messages: ChatMessage[];
  context: SonkeChatContext;
};

function geminiModel() {
  return process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
}

export async function POST(request: Request) {
  let body: ChatRequest;

  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return NextResponse.json({ source: "error", reply: "Invalid request." }, { status: 400 });
  }

  const geminiApiKey = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;

  const profileBlock = `Current profile:
Country: ${body.context.countryName}
Income: ${body.context.currencySymbol}${body.context.monthlyIncome.toLocaleString()}
Expenses: ${body.context.currencySymbol}${body.context.totalExpenses.toLocaleString()}
Difference: ${body.context.currencySymbol}${body.context.difference}
Living total: ${body.context.currencySymbol}${body.context.totalLiving.toLocaleString()}
Digital total: ${body.context.currencySymbol}${body.context.totalDigital.toLocaleString()}`;

  if (!geminiApiKey) {
    return NextResponse.json({
      source: "fallback",
      reply: sonkeChatFallback(body),
      hint: "Add GOOGLE_API_KEY to .env.local next to package.json.",
    });
  }

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
            parts: [{ text: SONKE_SYSTEM_PROMPT }],
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${profileBlock}\n\nUse these figures whenever the question is about money, affordability, or what to change.`,
                },
              ],
            },
            ...body.messages.map((message) => ({
              role: message.role === "assistant" ? "model" : "user",
              parts: [{ text: message.content }],
            })),
          ],
          generationConfig: { temperature: 0.45 },
          tools: [{ google_search: {} }],
        }),
      }
    );

    const rawText = await response.text();
    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.error("[sonke-chat] Gemini error:", response.status, rawText.slice(0, 500));
      }
      if (response.status === 429) {
        return NextResponse.json({
          source: "fallback",
          reply: sonkeChatFallback(body),
          hint: "Gemini quota is currently exhausted on this API key, so Sonke is replying with offline rules.",
        });
      }
      throw new Error(`Gemini request failed with ${response.status}`);
    }

    const data = JSON.parse(rawText);
    let reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

    reply = reply || sonkeChatFallback(body);

    return NextResponse.json({
      source: "ai",
      reply,
    });
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[sonke-chat]", e);
    }
    return NextResponse.json({
      source: "fallback",
      reply: sonkeChatFallback(body),
      hint: "Sonke could not reach the AI service, so this reply uses offline rules.",
    });
  }
}
