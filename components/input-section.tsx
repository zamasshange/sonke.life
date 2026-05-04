"use client";

import { useState, useEffect } from "react";
import { Plus, X, Wifi, Tv, Wrench, Monitor, User, Home, Smartphone, Zap, Car, ShoppingCart, Calendar, TrendingUp, Clock } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Country,
  Mode,
  JobType,
  SubscriptionItem,
  ToolItem,
  LivingCosts,
  COUNTRIES,
  JOB_LABELS,
  JOB_INCOMES,
  scaleCurrency,
} from "@/lib/types";

type BudgetPeriod = "weekly" | "monthly" | "yearly";

interface InputSectionProps {
  // User Profile
  country: Country;
  setCountry: (country: Country) => void;
  jobType: JobType;
  setJobType: (jobType: JobType) => void;
  customJobTitle: string;
  setCustomJobTitle: (title: string) => void;
  monthlyIncome: number;
  setMonthlyIncome: (income: number) => void;
  // Mode
  mode: Mode;
  setMode: (mode: Mode) => void;
  // Living Costs
  livingCosts: LivingCosts;
  setLivingCosts: React.Dispatch<React.SetStateAction<LivingCosts>>;
  // Digital Costs
  internetCost: number;
  setInternetCost: (cost: number) => void;
  subscriptions: SubscriptionItem[];
  setSubscriptions: React.Dispatch<React.SetStateAction<SubscriptionItem[]>>;
  tools: ToolItem[];
  setTools: React.Dispatch<React.SetStateAction<ToolItem[]>>;
  laptopPrice: number;
  setLaptopPrice: (price: number) => void;
  laptopMonths: number;
  setLaptopMonths: (months: number) => void;
  budgetPeriod: "weekly" | "monthly" | "yearly";
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.4, 0.25, 1] as const,
    },
  }),
};

const periodMultipliers: Record<BudgetPeriod, number> = {
  weekly: 1 / 4.33,
  monthly: 1,
  yearly: 12,
};

const periodLabels: Record<BudgetPeriod, { label: string; short: string; icon: React.ReactNode }> = {
  weekly: { label: "Weekly", short: "Wk", icon: <Clock className="h-3 w-3" /> },
  monthly: { label: "Monthly", short: "Mo", icon: <Calendar className="h-3 w-3" /> },
  yearly: { label: "Yearly", short: "Yr", icon: <TrendingUp className="h-3 w-3" /> },
};

export function InputSection({
  country,
  setCountry,
  jobType,
  setJobType,
  customJobTitle,
  setCustomJobTitle,
  monthlyIncome,
  setMonthlyIncome,
  mode,
  setMode,
  livingCosts,
  setLivingCosts,
  internetCost,
  setInternetCost,
  subscriptions,
  setSubscriptions,
  tools,
  setTools,
  laptopPrice,
  setLaptopPrice,
  laptopMonths,
  setLaptopMonths,
  budgetPeriod,
}: InputSectionProps) {
  const [displayIncome, setDisplayIncome] = useState(monthlyIncome);

  const currencySymbol = COUNTRIES[country].symbol;

  useEffect(() => {
    const multiplier = periodMultipliers[budgetPeriod];
    setDisplayIncome(Math.round(monthlyIncome * multiplier));
  }, [monthlyIncome, budgetPeriod]);

  const handleDisplayIncomeChange = (value: number) => {
    const multiplier = periodMultipliers[budgetPeriod];
    setMonthlyIncome(Math.round(value / multiplier));
  };

  const handleJobTypeChange = (newJobType: JobType) => {
    setJobType(newJobType);
    if (newJobType !== "custom") {
      setMonthlyIncome(scaleCurrency(JOB_INCOMES[newJobType], country));
    }
  };

  const updateLivingCost = (field: keyof LivingCosts, value: number) => {
    const multiplier = periodMultipliers[budgetPeriod];
    const monthlyValue = Math.round(value / multiplier);
    setLivingCosts(prev => ({ ...prev, [field]: monthlyValue }));
  };

  const getDisplayLivingCost = (value: number) => {
    const multiplier = periodMultipliers[budgetPeriod];
    return Math.round(value * multiplier);
  };

  const handleInternetCostChange = (value: number) => {
    const multiplier = periodMultipliers[budgetPeriod];
    setInternetCost(Math.round(value / multiplier));
  };

  const getDisplayInternetCost = () => {
    const multiplier = periodMultipliers[budgetPeriod];
    return Math.round(internetCost * multiplier);
  };

  const handleSubscriptionPriceChange = (id: string, price: number) => {
    const multiplier = periodMultipliers[budgetPeriod];
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, price: Math.round(price / multiplier) } : sub))
    );
  };

  const getDisplaySubscriptionPrice = (price: number) => {
    const multiplier = periodMultipliers[budgetPeriod];
    return Math.round(price * multiplier);
  };

  const handleToolPriceChange = (id: string, price: number) => {
    const multiplier = periodMultipliers[budgetPeriod];
    setTools((prev) =>
      prev.map((tool) => (tool.id === id ? { ...tool, price: Math.round(price / multiplier) } : tool))
    );
  };

  const getDisplayToolPrice = (price: number) => {
    const multiplier = periodMultipliers[budgetPeriod];
    return Math.round(price * multiplier);
  };

  const handleLaptopPriceChange = (value: number) => {
    const multiplier = periodMultipliers[budgetPeriod];
    setLaptopPrice(Math.round(value / multiplier));
  };

  const getDisplayLaptopPrice = () => {
    const multiplier = periodMultipliers[budgetPeriod];
    return Math.round(laptopPrice * multiplier);
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) =>
        sub.id === id ? { ...sub, enabled: !sub.enabled } : sub
      )
    );
  };

  const updateSubscriptionPrice = (id: string, price: number) => {
    const multiplier = periodMultipliers[budgetPeriod];
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, price: Math.round(price / multiplier) } : sub))
    );
  };

  const addCustomSubscription = () => {
    const newSub: SubscriptionItem = {
      id: `custom-sub-${Date.now()}`,
      name: "Custom",
      price: 0,
      enabled: true,
      isCustom: true,
    };
    setSubscriptions((prev) => [...prev, newSub]);
  };

  const updateSubscriptionName = (id: string, name: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, name } : sub))
    );
  };

  const removeSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((sub) => sub.id !== id));
  };

  const toggleTool = (id: string) => {
    setTools((prev) =>
      prev.map((tool) =>
        tool.id === id ? { ...tool, enabled: !tool.enabled } : tool
      )
    );
  };

  const updateToolPrice = (id: string, price: number) => {
    const multiplier = periodMultipliers[budgetPeriod];
    setTools((prev) =>
      prev.map((tool) => (tool.id === id ? { ...tool, price: Math.round(price / multiplier) } : tool))
    );
  };

  const addCustomTool = () => {
    const newTool: ToolItem = {
      id: `custom-tool-${Date.now()}`,
      name: "Custom Tool",
      price: 0,
      enabled: true,
      isCustom: true,
    };
    setTools((prev) => [...prev, newTool]);
  };

  const updateToolName = (id: string, name: string) => {
    setTools((prev) =>
      prev.map((tool) => (tool.id === id ? { ...tool, name } : tool))
    );
  };

  const removeTool = (id: string) => {
    setTools((prev) => prev.filter((tool) => tool.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Budget Period Selector */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-5 border border-primary/20 bg-gradient-to-r from-primary/5 to-orange-500/5"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            BUDGET PERIOD
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {(["weekly", "monthly", "yearly"] as BudgetPeriod[]).map((period) => (
            <motion.button
              key={period}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`py-4 px-3 font-semibold uppercase text-xs tracking-wide transition-all duration-200 flex flex-col items-center gap-2 ${
                budgetPeriod === period
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-white text-secondary-foreground hover:bg-secondary/80 border-2 border-transparent hover:border-primary/30"
              }`}
              onClick={() => setBudgetPeriod(period)}
            >
              {periodLabels[period].icon}
              <span>{periodLabels[period].label}</span>
            </motion.button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Values scale automatically</span>
          <span className="flex items-center gap-2 text-primary font-semibold">
            {budgetPeriod === "weekly" && "4.33 weeks / month"}
            {budgetPeriod === "monthly" && "Standard monthly view"}
            {budgetPeriod === "yearly" && "12 months / year"}
          </span>
        </div>
      </motion.div>
      {/* User Profile */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 border border-border bg-card/50"
      >
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            YOUR PROFILE
          </h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="country" className="text-xs uppercase tracking-wider text-muted-foreground">
              Country
            </Label>
            <Select value={country} onValueChange={(v) => setCountry(v as Country)}>
              <SelectTrigger id="country" className="bg-secondary border-border h-12 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(COUNTRIES).map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="flex items-center gap-2">
                      <span className="text-base leading-none">{c.flag}</span>
                      <span>{c.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jobType" className="text-xs uppercase tracking-wider text-muted-foreground">
              Job Type
            </Label>
            <Select value={jobType} onValueChange={(v) => handleJobTypeChange(v as JobType)}>
              <SelectTrigger id="jobType" className="bg-secondary border-border h-12 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(JOB_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {jobType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customJob" className="text-xs uppercase tracking-wider text-muted-foreground">
                Job Title
              </Label>
              <Input
                id="customJob"
                value={customJobTitle}
                onChange={(e) => setCustomJobTitle(e.target.value)}
                placeholder="Enter your job title"
                className="bg-secondary border-border h-12"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="income" className="text-xs uppercase tracking-wider text-muted-foreground">
              {periodLabels[budgetPeriod].label} Income ({COUNTRIES[country].currency})
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                {currencySymbol}
              </span>
              <Input
                id="income"
                type="number"
                value={displayIncome || ""}
                onChange={(e) => handleDisplayIncomeChange(Number(e.target.value) || 0)}
                onBlur={() => {
                  if (!displayIncome) {
                    const baseIncome = scaleCurrency(JOB_INCOMES[jobType], country);
                    setMonthlyIncome(baseIncome);
                  }
                }}
                placeholder="0"
                className="bg-secondary border-border h-12 pl-8 font-mono text-lg"
              />
            </div>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <span className="font-mono">{currencySymbol}{Math.round(monthlyIncome).toLocaleString()}</span>
              <span>per month</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mode Selector */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 border border-border bg-card/50"
      >
        <h3 className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">
          QUICK MODE
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(["student", "worker", "freelancer"] as Mode[]).map((m) => (
            <motion.button
              key={m}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`py-3 px-3 font-semibold uppercase text-xs tracking-wide transition-all duration-200 sm:px-4 sm:text-sm ${
                mode === m
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
              onClick={() => setMode(m)}
            >
              {m}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Living Costs */}
      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 border border-border bg-card/50"
      >
        <div className="flex items-center gap-2 mb-4">
          <Home className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            LIVING COSTS
          </h3>
        </div>
        <div className="space-y-4">
          {/* Rent */}
          <div className="flex items-center gap-3 p-3 bg-secondary/50 border border-border/50">
            <div className="p-2 bg-primary/10">
              <Home className="h-4 w-4 text-primary" />
            </div>
            <span className="flex-1 font-medium text-foreground text-sm">Rent</span>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs font-mono">{currencySymbol}</span>
              <Input
                type="number"
                value={getDisplayLivingCost(livingCosts.rent) || ""}
                onChange={(e) => updateLivingCost("rent", Number(e.target.value) || 0)}
                className="w-24 h-9 bg-secondary border-border font-mono text-sm"
              />
            </div>
          </div>

          {/* Groceries */}
          <div className="flex items-center gap-3 p-3 bg-secondary/50 border border-border/50">
            <div className="p-2 bg-primary/10">
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
            <span className="flex-1 font-medium text-foreground text-sm">Groceries</span>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs font-mono">{currencySymbol}</span>
              <Input
                type="number"
                value={getDisplayLivingCost(livingCosts.groceries) || ""}
                onChange={(e) => updateLivingCost("groceries", Number(e.target.value) || 0)}
                className="w-24 h-9 bg-secondary border-border font-mono text-sm"
              />
            </div>
          </div>

          {/* Transport */}
          <div className="flex items-center gap-3 p-3 bg-secondary/50 border border-border/50">
            <div className="p-2 bg-primary/10">
              <Car className="h-4 w-4 text-primary" />
            </div>
            <span className="flex-1 font-medium text-foreground text-sm">Transport</span>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs font-mono">{currencySymbol}</span>
              <Input
                type="number"
                value={getDisplayLivingCost(livingCosts.transport) || ""}
                onChange={(e) => updateLivingCost("transport", Number(e.target.value) || 0)}
                className="w-24 h-9 bg-secondary border-border font-mono text-sm"
              />
            </div>
          </div>

          {/* Electricity */}
          <div className="flex items-center gap-3 p-3 bg-secondary/50 border border-border/50">
            <div className="p-2 bg-primary/10">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <span className="flex-1 font-medium text-foreground text-sm">Electricity</span>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs font-mono">{currencySymbol}</span>
              <Input
                type="number"
                value={getDisplayLivingCost(livingCosts.electricity) || ""}
                onChange={(e) => updateLivingCost("electricity", Number(e.target.value) || 0)}
                className="w-24 h-9 bg-secondary border-border font-mono text-sm"
              />
            </div>
          </div>

          {/* Airtime / Mobile Data */}
          <div className="flex items-center gap-3 p-3 bg-secondary/50 border border-border/50">
            <div className="p-2 bg-primary/10">
              <Smartphone className="h-4 w-4 text-primary" />
            </div>
            <span className="flex-1 font-medium text-foreground text-sm">Airtime / Data</span>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground text-xs font-mono">{currencySymbol}</span>
              <Input
                type="number"
                value={getDisplayLivingCost(livingCosts.airtime) || ""}
                onChange={(e) => updateLivingCost("airtime", Number(e.target.value) || 0)}
                className="w-24 h-9 bg-secondary border-border font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Internet */}
      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 border border-border bg-card/50"
      >
        <div className="flex items-center gap-2 mb-4">
          <Wifi className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            INTERNET
          </h3>
        </div>
        <div className="space-y-2">
          <Label htmlFor="internet" className="text-xs uppercase tracking-wider text-muted-foreground">
            {periodLabels[budgetPeriod].short} Internet Cost ({COUNTRIES[country].currency})
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
              {currencySymbol}
            </span>
            <Input
              id="internet"
              type="number"
              value={getDisplayInternetCost() || ""}
              onChange={(e) => handleInternetCostChange(Number(e.target.value) || 0)}
              placeholder="0"
              className="bg-secondary border-border h-12 pl-8 font-mono text-lg"
            />
          </div>
        </div>
      </motion.div>

      {/* Subscriptions */}
      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 border border-border bg-card/50"
      >
        <div className="flex items-center gap-2 mb-4">
          <Tv className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            SUBSCRIPTIONS
          </h3>
        </div>
        <div className="space-y-3">
          {subscriptions.map((sub, index) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-wrap items-center gap-3 p-3 bg-secondary/50 border border-border/50 sm:flex-nowrap"
            >
              <Switch
                checked={sub.enabled}
                onCheckedChange={() => toggleSubscription(sub.id)}
                className="data-[state=checked]:bg-primary"
              />
              {sub.isCustom ? (
                <Input
                  value={sub.name}
                  onChange={(e) => updateSubscriptionName(sub.id, e.target.value)}
                  className="flex-1 h-9 bg-secondary border-border text-sm"
                  placeholder="Name"
                />
              ) : (
                <span className="flex-1 font-medium text-foreground text-sm">
                  {sub.name}
                </span>
              )}
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-xs font-mono">{currencySymbol}</span>
                <Input
                  type="number"
                  value={getDisplaySubscriptionPrice(sub.price) || ""}
                  onChange={(e) =>
                    updateSubscriptionPrice(sub.id, Number(e.target.value) || 0)
                  }
                  className="h-9 w-20 bg-secondary border-border font-mono text-sm"
                  disabled={!sub.enabled}
                />
              </div>
              {sub.isCustom && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeSubscription(sub.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
          <Button
            variant="outline"
            className="w-full border-dashed border-border hover:border-primary hover:text-primary transition-colors"
            onClick={addCustomSubscription}
          >
            <Plus className="h-4 w-4 mr-2" />
            ADD CUSTOM
          </Button>
        </div>
      </motion.div>

      {/* Tools */}
      <motion.div
        custom={5}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 border border-border bg-card/50"
      >
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            TOOLS & SERVICES
          </h3>
        </div>
        <div className="space-y-3">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-wrap items-center gap-3 p-3 bg-secondary/50 border border-border/50 sm:flex-nowrap"
            >
              <Switch
                checked={tool.enabled}
                onCheckedChange={() => toggleTool(tool.id)}
                className="data-[state=checked]:bg-primary"
              />
              {tool.isCustom ? (
                <Input
                  value={tool.name}
                  onChange={(e) => updateToolName(tool.id, e.target.value)}
                  className="flex-1 h-9 bg-secondary border-border text-sm"
                  placeholder="Name"
                />
              ) : (
                <span className="flex-1 font-medium text-foreground text-sm">
                  {tool.name}
                </span>
              )}
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground text-xs font-mono">{currencySymbol}</span>
                <Input
                  type="number"
                  value={getDisplayToolPrice(tool.price) || ""}
                  onChange={(e) =>
                    updateToolPrice(tool.id, Number(e.target.value) || 0)
                  }
                  className="w-20 h-9 bg-secondary border-border font-mono text-sm"
                  disabled={!tool.enabled}
                />
              </div>
              {tool.isCustom && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeTool(tool.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </motion.div>
          ))}
          <Button
            variant="outline"
            className="w-full border-dashed border-border hover:border-primary hover:text-primary transition-colors"
            onClick={addCustomTool}
          >
            <Plus className="h-4 w-4 mr-2" />
            ADD CUSTOM
          </Button>
        </div>
      </motion.div>

      {/* Hardware */}
      <motion.div
        custom={6}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="p-6 border border-border bg-card/50"
      >
        <div className="flex items-center gap-2 mb-4">
          <Monitor className="h-4 w-4 text-primary" />
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            HARDWARE DEPRECIATION
          </h3>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="laptop" className="text-xs uppercase tracking-wider text-muted-foreground">
              Device Price ({COUNTRIES[country].currency})
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">
                {currencySymbol}
              </span>
              <Input
                id="laptop"
                type="number"
                value={getDisplayLaptopPrice() || ""}
                onChange={(e) => handleLaptopPriceChange(Number(e.target.value) || 0)}
                placeholder="0"
                className="bg-secondary border-border h-12 pl-8 font-mono text-lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="months" className="text-xs uppercase tracking-wider text-muted-foreground">
              Depreciation Period
            </Label>
            <Select
              value={laptopMonths.toString()}
              onValueChange={(v) => setLaptopMonths(Number(v))}
            >
              <SelectTrigger id="months" className="bg-secondary border-border h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24">24 months (2 years)</SelectItem>
                <SelectItem value="36">36 months (3 years)</SelectItem>
                <SelectItem value="48">48 months (4 years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 bg-primary/10 border border-primary/20">
            <p className="text-sm text-muted-foreground">
              {periodLabels[budgetPeriod].short} hardware cost:{" "}
              <span className="font-mono font-semibold text-primary">
                {currencySymbol}{Math.round((laptopPrice / laptopMonths) * periodMultipliers[budgetPeriod]).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
