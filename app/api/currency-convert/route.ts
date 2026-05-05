import { NextResponse } from "next/server";

type ConvertRequest = {
  amount: number;
  from: string;
  to: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.FREECURRENCY_API_KEY;
  const body = (await request.json().catch(() => null)) as ConvertRequest | null;

  if (!body || typeof body.amount !== "number" || !body.from || !body.to) {
    return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
  }

  const amount = Number.isFinite(body.amount) ? body.amount : 0;
  const from = body.from.toUpperCase();
  const to = body.to.toUpperCase();

  if (!apiKey) {
    return NextResponse.json({ error: "Missing FREECURRENCY_API_KEY." }, { status: 500 });
  }

  if (from === to) {
    return NextResponse.json({
      source: "same",
      amount,
      from,
      to,
      converted: amount,
      rate: 1,
    });
  }

  try {
    const response = await fetch(
      `https://api.freecurrencyapi.com/v1/latest?base_currency=${encodeURIComponent(
        from
      )}&currencies=${encodeURIComponent(to)}`,
      {
        headers: {
          apikey: apiKey,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Currency API failed (${response.status}): ${message.slice(0, 200)}`);
    }

    const data = (await response.json()) as {
      data?: Record<string, number>;
    };

    const rate = data.data?.[to];
    if (typeof rate !== "number") {
      throw new Error("Rate not found in currency response.");
    }

    return NextResponse.json({
      source: "api",
      amount,
      from,
      to,
      converted: amount * rate,
      rate,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[currency-convert]", error);
    }
    return NextResponse.json({ error: "Could not convert currency right now." }, { status: 502 });
  }
}
