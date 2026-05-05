"use client";

import { useRef, useState } from "react";
import { Check, Download, FileText, ImageDown, Sparkles, TrendingUp, TrendingDown, Wallet, Zap, Wifi, CreditCard, PiggyBank, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { CostBreakdown, Country, COUNTRIES } from "@/lib/types";

interface ShareCardProps {
  breakdown: CostBreakdown;
  monthlyIncome: number;
  country: Country;
}

type StatementItem = {
  label: string;
  amount: number;
  group: "Living" | "Digital";
  icon: string;
  color: string;
};

const motivationalQuotes = [
  "Every rand counts toward your dreams.",
  "Track today, thrive tomorrow.",
  "Your budget is your superpower.",
  "Small cuts lead to big gains.",
  "Know where it goes, know where to grow.",
  "Financial freedom starts with awareness.",
];

const tips = [
  { icon: "💡", text: "Review subscriptions monthly" },
  { icon: "🚌", text: "Use public transport when possible" },
  { icon: "🍳", text: "Meal prep to reduce food costs" },
  { icon: "📱", text: "Check data bundles before buying" },
  { icon: "💻", text: "Annual software plans save 20%" },
  { icon: "⚡", text: "Switch off lights to cut electricity" },
];

export function ShareCard({ breakdown, monthlyIncome, country }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState("");
  const [activeQuote] = useState(Math.floor(Math.random() * motivationalQuotes.length));

  const { symbol, currency, name, flag } = COUNTRIES[country];
  const difference = monthlyIncome - breakdown.total;
  const isPositive = difference >= 0;
  const percentageUsed = monthlyIncome > 0 ? Math.round((breakdown.total / monthlyIncome) * 100) : 0;
  const generatedDate = new Intl.DateTimeFormat("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  // Deterministic document ID based on breakdown data to avoid hydration mismatch
  const generateDocumentId = () => {
    const dataStr = JSON.stringify({ breakdown, monthlyIncome, country });
    let hash = 0;
    for (let i = 0; i < dataStr.length; i++) {
      const char = dataStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).toUpperCase();
  };
  const documentId = generateDocumentId();

  const formatCurrency = (amount: number) => {
    return `${symbol}${Math.abs(Math.round(amount)).toLocaleString()}`;
  };

  const rawStatementItems: StatementItem[] = [
    { label: "Rent & Housing", amount: breakdown.living.rent, group: "Living", icon: "🏠", color: "#3B82F6" },
    { label: "Groceries & Food", amount: breakdown.living.groceries, group: "Living", icon: "🛒", color: "#10B981" },
    { label: "Transport & Travel", amount: breakdown.living.transport, group: "Living", icon: "🚌", color: "#F59E0B" },
    { label: "Electricity & Utilities", amount: breakdown.living.electricity, group: "Living", icon: "⚡", color: "#EF4444" },
    { label: "Airtime & Data", amount: breakdown.living.airtime, group: "Living", icon: "📱", color: "#8B5CF6" },
    { label: "Internet Connection", amount: breakdown.digital.internet, group: "Digital", icon: "🌐", color: "#06B6D4" },
    { label: "Subscriptions", amount: breakdown.digital.subscriptions, group: "Digital", icon: "📺", color: "#EC4899" },
    { label: "Tools & Software", amount: breakdown.digital.tools, group: "Digital", icon: "🛠️", color: "#6366F1" },
    { label: "Device Depreciation", amount: breakdown.digital.hardware, group: "Digital", icon: "💻", color: "#84CC16" },
  ];
  const statementItems = rawStatementItems.filter((item) => item.amount > 0);

  const generatePng = async () => {
    if (!cardRef.current) return "";

    return toPng(cardRef.current, {
      quality: 1,
      pixelRatio: 2,
      backgroundColor: "#FFFFFF",
    });
  };

  const handleDownloadImage = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await generatePng();
      const link = document.createElement("a");
      link.download = `sonke-statement-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
      setDownloaded("image");
      setTimeout(() => setDownloaded(""), 2000);
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await generatePng();
      const printWindow = window.open("", "_blank", "width=900,height=1200");

      if (!printWindow) {
        return;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>Sonke Life Cost Statement</title>
            <style>
              body { margin: 0; background: #f3f3f3; font-family: 'Helvetica Neue', Arial, sans-serif; }
              .page { min-height: 100vh; display: grid; place-items: center; padding: 24px; }
              img { width: 100%; max-width: 820px; display: block; box-shadow: 0 20px 70px rgba(0,0,0,.12); }
              @media print {
                body { background: #fff; }
                .page { padding: 0; min-height: auto; }
                img { max-width: 100%; box-shadow: none; }
              }
            </style>
          </head>
          <body>
            <div class="page">
              <img src="${dataUrl}" alt="Sonke Life Cost Statement" />
            </div>
            <script>
              window.onload = () => {
                window.focus();
                setTimeout(() => window.print(), 300);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      setDownloaded("pdf");
      setTimeout(() => setDownloaded(""), 2000);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="border border-border bg-card/50 p-6 backdrop-blur-sm"
    >
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
          Sonke Statement Export
        </h3>
      </div>

      <div
        ref={cardRef}
        className="bg-white p-4 sm:p-6 md:p-8 text-black shadow-lg relative overflow-hidden"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Decorative gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-orange-500 to-amber-600" />

        {/* Header with logo and title */}
        <div className="border-b-2 border-black pb-4 sm:pb-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-8">
            <div className="flex items-center gap-3 sm:gap-5">
              <div className="grid h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 place-items-center overflow-hidden rounded-sm">
                <img src="/images/favicon.png" alt="Sonke mark" className="h-full w-full object-contain" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-black">Sonke</h3>
                <p className="text-[9px] sm:text-xs font-bold uppercase tracking-[0.28em] text-black/60 mt-1">
                  Financial Reality Statement
                </p>
                <div className="flex items-center gap-2 mt-2 sm:mt-3">
                  <span className="px-2 py-1 bg-primary text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                    {flag} {name}
                  </span>
                  <span className="px-2 py-1 bg-black/10 text-black/60 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                    {currency}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Statement Date</p>
              <p className="mt-1 font-mono font-bold text-black text-sm sm:text-lg">{generatedDate}</p>
              <p className="mt-2 sm:mt-4 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Document ID</p>
              <p className="font-mono text-xs text-black/60">SK-{documentId}</p>
            </div>
          </div>
        </div>

        {/* Main summary cards with enhanced styling */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 p-3 sm:p-5 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700">Monthly Income</p>
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-black text-emerald-800">{formatCurrency(monthlyIncome)}</p>
            <p className="text-[8px] sm:text-[10px] text-emerald-600 mt-1">Take-home pay</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 p-3 sm:p-5 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-red-700">Total Expenses</p>
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-black text-red-800">{formatCurrency(breakdown.total)}</p>
            <p className="text-[8px] sm:text-[10px] text-red-600 mt-1">{statementItems.length} categories</p>
          </div>
          <div className={`p-3 sm:p-5 rounded-sm ${isPositive ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white" : "bg-gradient-to-br from-primary to-orange-500 text-white"}`}>
            <div className="flex items-center gap-2 mb-2">
              {isPositive ? <PiggyBank className="h-3 w-3 sm:h-4 sm:w-4 text-white/80" /> : <Target className="h-3 w-3 sm:h-4 sm:w-4 text-white/80" />}
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-white/80">
                {isPositive ? "Surplus" : "Shortfall"}
              </p>
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-black">{formatCurrency(difference)}</p>
            <p className="text-[8px] sm:text-[10px] text-white/80 mt-1">
              {isPositive ? `${percentageUsed}% used` : `${100 - percentageUsed}% gap`}
            </p>
          </div>
        </div>

        {/* Progress bar visualization */}
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[9px] sm:text-xs font-black uppercase tracking-[0.18em] text-black/60">Income Utilization</p>
            <p className="text-[9px] sm:text-xs font-bold font-mono text-black">{percentageUsed}%</p>
          </div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentageUsed, 100)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`h-full rounded-full ${percentageUsed > 90 ? "bg-red-500" : percentageUsed > 75 ? "bg-amber-500" : "bg-emerald-500"}`}
            />
          </div>
          <div className="flex justify-between mt-2 text-[8px] sm:text-[10px] text-black/40">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Detailed breakdown with icons - Desktop Table */}
        <div className="hidden sm:block mb-6 sm:mb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60 mb-4">Expense Breakdown</p>
          <div className="bg-gray-50 rounded-sm border border-gray-200 p-4">
            <div className="grid grid-cols-12 gap-3 pb-3 border-b border-gray-200 text-[10px] font-black uppercase tracking-[0.15em] text-black/50">
              <div className="col-span-5">Category</div>
              <div className="col-span-3">Type</div>
              <div className="col-span-2 text-center">% of Total</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            <div className="divide-y divide-gray-100">
              {statementItems.map((item) => (
                <motion.div
                  key={`${item.group}-${item.label}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="grid grid-cols-12 gap-3 py-3 text-sm items-center"
                >
                  <div className="col-span-5 flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-bold text-black">{item.label}</span>
                  </div>
                  <div className="col-span-3">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-sm ${
                      item.group === "Living"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {item.group}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="font-mono text-xs text-black/60">
                      {breakdown.total > 0 ? Math.round((item.amount / breakdown.total) * 100) : 0}%
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-mono font-bold text-black">
                    {formatCurrency(item.amount)}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed breakdown with icons - Mobile Cards */}
        <div className="sm:hidden mb-6 sm:mb-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/60 mb-4">Expense Breakdown</p>
          <div className="space-y-3">
            {statementItems.map((item) => (
              <motion.div
                key={`${item.group}-${item.label}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-50 rounded-sm border border-gray-200 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-bold text-black text-sm">{item.label}</span>
                  </div>
                  <span className="font-mono font-bold text-black">
                    {formatCurrency(item.amount)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-sm ${
                    item.group === "Living"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-purple-100 text-purple-700"
                  }`}>
                    {item.group}
                  </span>
                  <span className="font-mono text-xs text-black/60">
                    {breakdown.total > 0 ? Math.round((item.amount / breakdown.total) * 100) : 0}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Living vs Digital comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-blue-50 border border-blue-200 p-3 sm:p-5 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <p className="text-[9px] sm:text-xs font-black uppercase tracking-[0.18em] text-blue-700">Living Costs</p>
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-black text-blue-800">{formatCurrency(breakdown.totalLiving)}</p>
            <div className="mt-2 sm:mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${breakdown.total > 0 ? Math.round((breakdown.totalLiving / breakdown.total) * 100) : 0}%` }}
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-bold text-blue-600">
                {breakdown.total > 0 ? Math.round((breakdown.totalLiving / breakdown.total) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-3 sm:p-5 rounded-sm">
            <div className="flex items-center gap-2 mb-2">
              <Wifi className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <p className="text-[9px] sm:text-xs font-black uppercase tracking-[0.18em] text-purple-700">Digital Costs</p>
            </div>
            <p className="font-mono text-2xl sm:text-3xl font-black text-purple-800">{formatCurrency(breakdown.totalDigital)}</p>
            <div className="mt-2 sm:mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-purple-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600"
                  style={{ width: `${breakdown.total > 0 ? Math.round((breakdown.totalDigital / breakdown.total) * 100) : 0}%` }}
                />
              </div>
              <span className="text-[8px] sm:text-[10px] font-bold text-purple-600">
                {breakdown.total > 0 ? Math.round((breakdown.totalDigital / breakdown.total) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Motivational quote */}
        <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-primary/10 via-orange-500/10 to-amber-500/10 border border-primary/20 rounded-sm">
          <p className="text-xs sm:text-sm italic text-black/70">"{motivationalQuotes[activeQuote]}"</p>
        </div>

        {/* Yearly projection */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="p-3 sm:p-4 border border-black/10 rounded-sm text-center">
            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-black/50">Weekly Average</p>
            <p className="font-mono text-lg sm:text-xl font-black text-black mt-1">{formatCurrency(breakdown.total / 4.33)}</p>
          </div>
          <div className="p-3 sm:p-4 bg-black text-white rounded-sm text-center">
            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-white/70">Yearly Total</p>
            <p className="font-mono text-lg sm:text-xl font-black text-white mt-1">{formatCurrency(breakdown.total * 12)}</p>
          </div>
          <div className="p-3 sm:p-4 border border-black/10 rounded-sm text-center">
            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-black/50">Daily Average</p>
            <p className="font-mono text-lg sm:text-xl font-black text-black mt-1">{formatCurrency(breakdown.total / 30)}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t-2 border-black pt-4">
          <div className="flex items-center gap-4">
            <img src="/images/favicon.png" alt="Sonke" className="h-8 w-8 opacity-60" />
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-black">sonke.life</p>
              <p className="text-[10px] text-black/50">Budget mirror, not bank advice</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-black/60">Generated via Sonke Calculator</p>
            <p className="text-[10px] text-black/40">{generatedDate}</p>
          </div>
        </div>

        {/* Watermark */}
        <div className="absolute bottom-4 right-4 opacity-5 pointer-events-none">
          <p className="text-6xl font-black uppercase tracking-wider text-black">Sonke</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button
          className="h-12 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleDownloadImage}
          disabled={isDownloading}
        >
          {downloaded === "image" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Image Saved
            </>
          ) : (
            <>
              <ImageDown className="mr-2 h-4 w-4" />
              Export Image
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={handleDownloadPdf}
          disabled={isDownloading}
        >
          {downloaded === "pdf" ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              PDF Ready
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Export PDF
            </>
          )}
        </Button>
      </div>

      {isDownloading && (
        <p className="mt-3 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Download className="h-3 w-3 animate-pulse" />
          Preparing your statement...
        </p>
      )}
    </motion.div>
  );
}
