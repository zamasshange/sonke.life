"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Sparkles, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CostBreakdown, Country, COUNTRIES } from "@/lib/types";

type LiveKnowledgePanelProps = {
  country: Country;
  monthlyIncome: number;
  breakdown: CostBreakdown;
};

type KnowledgeResponse = {
  source?: "ai" | "fallback";
  highlights?: string[];
  actions?: string[];
  note?: string;
  updatedAt?: number;
};

export function LiveKnowledgePanel({ country, monthlyIncome, breakdown }: LiveKnowledgePanelProps) {
  const [loading, setLoading] = useState(false);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [source, setSource] = useState<"ai" | "fallback" | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  const topCosts = useMemo(
    () =>
      [
        { name: "Rent", amount: breakdown.living.rent },
        { name: "Groceries", amount: breakdown.living.groceries },
        { name: "Transport", amount: breakdown.living.transport },
        { name: "Electricity", amount: breakdown.living.electricity },
        { name: "Airtime", amount: breakdown.living.airtime },
        { name: "Internet", amount: breakdown.digital.internet },
        { name: "Subscriptions", amount: breakdown.digital.subscriptions },
        { name: "Tools", amount: breakdown.digital.tools },
        { name: "Hardware", amount: breakdown.digital.hardware },
      ]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3),
    [breakdown]
  );

  const loadKnowledge = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/live-knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          country,
          monthlyIncome,
          totalExpenses: breakdown.total,
          topCosts,
          refreshToken: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        }),
      });

      const data = (await response.json()) as KnowledgeResponse;
      setHighlights(Array.isArray(data.highlights) ? data.highlights : []);
      setActions(Array.isArray(data.actions) ? data.actions : []);
      setSource(data.source === "ai" ? "ai" : "fallback");
      setNote(typeof data.note === "string" ? data.note : null);
      setUpdatedAt(typeof data.updatedAt === "number" ? data.updatedAt : Date.now());
    } catch {
      setHighlights([]);
      setActions([]);
      setSource("fallback");
      setNote("Could not refresh right now.");
      setUpdatedAt(Date.now());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKnowledge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, monthlyIncome, breakdown.total]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      loadKnowledge();
    }, 45000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, monthlyIncome, breakdown.total]);

  const sym = COUNTRIES[country].symbol;

  return (
    <div className="border border-border bg-card/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            Live Knowledge Feed
          </h3>
        </div>
        <Button variant="outline" size="sm" onClick={loadKnowledge} disabled={loading}>
          <RefreshCw className={`mr-2 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
        <span className={`rounded-full px-2 py-0.5 font-bold uppercase tracking-wider ${source === "ai" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>
          {source === "ai" ? "AI live" : "Offline mode"}
        </span>
        {updatedAt && (
          <span className="text-muted-foreground">
            Updated {new Date(updatedAt).toLocaleTimeString()}
          </span>
        )}
      </div>
      {note && <p className="mb-3 text-xs text-muted-foreground">{note}</p>}

      <p className="mb-5 text-sm text-muted-foreground">
        Real-world insights for {COUNTRIES[country].name} based on your current budget ({sym}
        {breakdown.total.toLocaleString()} spend vs {sym}
        {monthlyIncome.toLocaleString()} income).
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-sm border border-black/10 bg-white/80 p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-black/60">
            What matters now
          </p>
          <div className="space-y-2 text-sm text-black/80">
            {highlights.length > 0 ? (
              highlights.map((item) => (
                <p key={item} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">Loading current insights...</p>
            )}
          </div>
        </div>

        <div className="rounded-sm border border-black/10 bg-white/80 p-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-black/60">
            Next best actions
          </p>
          <div className="space-y-2 text-sm text-black/80">
            {actions.length > 0 ? (
              actions.map((item) => (
                <p key={item} className="flex gap-2">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <span>{item}</span>
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">Loading action ideas...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
