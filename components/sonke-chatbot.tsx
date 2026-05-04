"use client";

import { FormEvent, useMemo, useState } from "react";
import { Send, User } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CostBreakdown, Country, COUNTRIES } from "@/lib/types";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

interface SonkeChatbotProps {
  breakdown: CostBreakdown;
  monthlyIncome: number;
  country: Country;
}

const starterQuestions = [
  "Hello",
  "What should I cut first?",
  "Can I survive this month?",
];

export function SonkeChatbot({ breakdown, monthlyIncome, country }: SonkeChatbotProps) {
  const countryInfo = COUNTRIES[country];
  const difference = monthlyIncome - breakdown.total;
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I am Sonke. Ask me what to cut, how to close your monthly gap, or how to make your budget breathe.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSource, setLastSource] = useState<"ai" | "fallback" | null>(null);
  const [lastHint, setLastHint] = useState<string | null>(null);

  const context = useMemo(
    () => ({
      countryName: countryInfo.name,
      currencySymbol: countryInfo.symbol,
      monthlyIncome,
      totalExpenses: breakdown.total,
      difference,
      totalLiving: breakdown.totalLiving,
      totalDigital: breakdown.totalDigital,
    }),
    [breakdown.total, breakdown.totalDigital, breakdown.totalLiving, countryInfo.name, countryInfo.symbol, difference, monthlyIncome]
  );

  const sendMessage = async (messageText: string) => {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/sonke-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.slice(-8),
          context,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat failed");
      }

      const data = (await response.json()) as { reply: string; source?: string; hint?: string };
      setLastSource(data.source === "ai" ? "ai" : "fallback");
      setLastHint(typeof data.hint === "string" ? data.hint : null);
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch {
      setLastSource("fallback");
      setLastHint(null);
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: "I could not answer right now. Try asking again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.48, duration: 0.5 }}
      className="border border-black/15 bg-white p-6"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-black/10 bg-secondary">
              <img src="/images/logo.png" alt="Sonke logo" className="h-[85%] w-[85%] object-contain" />
            </span>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
              Sonke Chatbot
            </h3>
            {lastSource && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  lastSource === "ai" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
                }`}
              >
                {lastSource === "ai" ? "Live AI" : "Offline tips"}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Ask questions about your budget using the numbers on this page.
          </p>
          {lastHint && (
            <p className="mt-2 text-xs leading-snug text-muted-foreground">{lastHint}</p>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {starterQuestions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => void sendMessage(question)}
            className="border border-black/10 bg-secondary px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-black hover:text-white"
          >
            {question}
          </button>
        ))}
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto border-y border-black/10 py-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden">
                <img src="/images/favicon.png" alt="Sonke mark" className="h-full w-full object-contain" />
              </span>
            )}
            <p
              className={`max-w-[82%] p-3 text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-black text-white"
                  : "bg-secondary text-foreground"
              }`}
            >
              {message.content}
            </p>
            {message.role === "user" && (
              <span className="grid h-8 w-8 shrink-0 place-items-center bg-black text-white">
                <User className="h-4 w-4" />
              </span>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden">
              <img src="/images/favicon.png" alt="Sonke mark" className="h-full w-full object-contain" />
            </span>
            <p className="bg-secondary p-3 text-sm text-muted-foreground">Thinking...</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask Sonke what to do next..."
          className="h-11 bg-secondary"
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="h-11 bg-primary text-white">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </motion.div>
  );
}
