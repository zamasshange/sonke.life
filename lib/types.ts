export type Country =
  | "ZA"
  | "US"
  | "GB"
  | "NG"
  | "KE"
  | "GH"
  | "TZ"
  | "UG"
  | "RW"
  | "BW"
  | "NA"
  | "ZM"
  | "ZW"
  | "MZ"
  | "AO"
  | "EG"
  | "MA"
  | "TN"
  | "ET"
  | "IN"
  | "PK"
  | "BD"
  | "AE"
  | "SA"
  | "TR"
  | "DE"
  | "FR"
  | "ES"
  | "IT"
  | "NL"
  | "SE"
  | "NO"
  | "CH"
  | "IE"
  | "AU"
  | "NZ"
  | "CA"
  | "BR"
  | "MX"
  | "AR"
  | "CL"
  | "CO"
  | "JP"
  | "KR"
  | "SG";

export type Mode = "student" | "worker" | "freelancer";

export type JobType = "teacher" | "waiter" | "civil_servant" | "student" | "custom";

export interface SubscriptionItem {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
  isCustom?: boolean;
}

export interface ToolItem {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
  isCustom?: boolean;
}

export interface LivingCosts {
  rent: number;
  groceries: number;
  transport: number;
  electricity: number;
  airtime: number;
}

export interface DigitalCosts {
  internet: number;
  subscriptions: number;
  tools: number;
  hardware: number;
}

export interface CostBreakdown {
  living: LivingCosts;
  digital: DigitalCosts;
  totalLiving: number;
  totalDigital: number;
  total: number;
}

export interface UserProfile {
  country: Country;
  jobType: JobType;
  customJobTitle: string;
  monthlyIncome: number;
}

export interface CountryInfo {
  code: Country;
  name: string;
  currency: string;
  symbol: string;
  multiplier: number;
  flag: string;
}

export const COUNTRIES: Record<Country, CountryInfo> = {
  ZA: { code: "ZA", name: "South Africa", currency: "ZAR", symbol: "R", multiplier: 1.0, flag: "🇿🇦" },
  US: { code: "US", name: "United States", currency: "USD", symbol: "$", multiplier: 2.5, flag: "🇺🇸" },
  GB: { code: "GB", name: "United Kingdom", currency: "GBP", symbol: "£", multiplier: 2.0, flag: "🇬🇧" },
  NG: { code: "NG", name: "Nigeria", currency: "NGN", symbol: "₦", multiplier: 0.7, flag: "🇳🇬" },
  KE: { code: "KE", name: "Kenya", currency: "KES", symbol: "KSh", multiplier: 0.75, flag: "🇰🇪" },
  GH: { code: "GH", name: "Ghana", currency: "GHS", symbol: "GH₵", multiplier: 0.9, flag: "🇬🇭" },
  TZ: { code: "TZ", name: "Tanzania", currency: "TZS", symbol: "TSh", multiplier: 0.55, flag: "🇹🇿" },
  UG: { code: "UG", name: "Uganda", currency: "UGX", symbol: "USh", multiplier: 0.55, flag: "🇺🇬" },
  RW: { code: "RW", name: "Rwanda", currency: "RWF", symbol: "RF", multiplier: 0.6, flag: "🇷🇼" },
  BW: { code: "BW", name: "Botswana", currency: "BWP", symbol: "P", multiplier: 1.0, flag: "🇧🇼" },
  NA: { code: "NA", name: "Namibia", currency: "NAD", symbol: "N$", multiplier: 1.0, flag: "🇳🇦" },
  ZM: { code: "ZM", name: "Zambia", currency: "ZMW", symbol: "K", multiplier: 0.75, flag: "🇿🇲" },
  ZW: { code: "ZW", name: "Zimbabwe", currency: "ZWL", symbol: "Z$", multiplier: 0.8, flag: "🇿🇼" },
  MZ: { code: "MZ", name: "Mozambique", currency: "MZN", symbol: "MT", multiplier: 0.75, flag: "🇲🇿" },
  AO: { code: "AO", name: "Angola", currency: "AOA", symbol: "Kz", multiplier: 0.85, flag: "🇦🇴" },
  EG: { code: "EG", name: "Egypt", currency: "EGP", symbol: "E£", multiplier: 0.95, flag: "🇪🇬" },
  MA: { code: "MA", name: "Morocco", currency: "MAD", symbol: "DH", multiplier: 1.05, flag: "🇲🇦" },
  TN: { code: "TN", name: "Tunisia", currency: "TND", symbol: "DT", multiplier: 1.2, flag: "🇹🇳" },
  ET: { code: "ET", name: "Ethiopia", currency: "ETB", symbol: "Br", multiplier: 0.55, flag: "🇪🇹" },
  IN: { code: "IN", name: "India", currency: "INR", symbol: "₹", multiplier: 0.95, flag: "🇮🇳" },
  PK: { code: "PK", name: "Pakistan", currency: "PKR", symbol: "₨", multiplier: 0.65, flag: "🇵🇰" },
  BD: { code: "BD", name: "Bangladesh", currency: "BDT", symbol: "৳", multiplier: 0.6, flag: "🇧🇩" },
  AE: { code: "AE", name: "United Arab Emirates", currency: "AED", symbol: "د.إ", multiplier: 2.2, flag: "🇦🇪" },
  SA: { code: "SA", name: "Saudi Arabia", currency: "SAR", symbol: "﷼", multiplier: 2.2, flag: "🇸🇦" },
  TR: { code: "TR", name: "Turkey", currency: "TRY", symbol: "₺", multiplier: 1.1, flag: "🇹🇷" },
  DE: { code: "DE", name: "Germany", currency: "EUR", symbol: "€", multiplier: 2.3, flag: "🇩🇪" },
  FR: { code: "FR", name: "France", currency: "EUR", symbol: "€", multiplier: 2.3, flag: "🇫🇷" },
  ES: { code: "ES", name: "Spain", currency: "EUR", symbol: "€", multiplier: 2.2, flag: "🇪🇸" },
  IT: { code: "IT", name: "Italy", currency: "EUR", symbol: "€", multiplier: 2.2, flag: "🇮🇹" },
  NL: { code: "NL", name: "Netherlands", currency: "EUR", symbol: "€", multiplier: 2.4, flag: "🇳🇱" },
  SE: { code: "SE", name: "Sweden", currency: "SEK", symbol: "kr", multiplier: 2.4, flag: "🇸🇪" },
  NO: { code: "NO", name: "Norway", currency: "NOK", symbol: "kr", multiplier: 2.7, flag: "🇳🇴" },
  CH: { code: "CH", name: "Switzerland", currency: "CHF", symbol: "CHF", multiplier: 2.9, flag: "🇨🇭" },
  IE: { code: "IE", name: "Ireland", currency: "EUR", symbol: "€", multiplier: 2.4, flag: "🇮🇪" },
  AU: { code: "AU", name: "Australia", currency: "AUD", symbol: "A$", multiplier: 2.4, flag: "🇦🇺" },
  NZ: { code: "NZ", name: "New Zealand", currency: "NZD", symbol: "NZ$", multiplier: 2.3, flag: "🇳🇿" },
  CA: { code: "CA", name: "Canada", currency: "CAD", symbol: "C$", multiplier: 2.4, flag: "🇨🇦" },
  BR: { code: "BR", name: "Brazil", currency: "BRL", symbol: "R$", multiplier: 1.2, flag: "🇧🇷" },
  MX: { code: "MX", name: "Mexico", currency: "MXN", symbol: "$", multiplier: 1.0, flag: "🇲🇽" },
  AR: { code: "AR", name: "Argentina", currency: "ARS", symbol: "$", multiplier: 1.0, flag: "🇦🇷" },
  CL: { code: "CL", name: "Chile", currency: "CLP", symbol: "$", multiplier: 1.2, flag: "🇨🇱" },
  CO: { code: "CO", name: "Colombia", currency: "COP", symbol: "$", multiplier: 0.95, flag: "🇨🇴" },
  JP: { code: "JP", name: "Japan", currency: "JPY", symbol: "¥", multiplier: 2.6, flag: "🇯🇵" },
  KR: { code: "KR", name: "South Korea", currency: "KRW", symbol: "₩", multiplier: 2.4, flag: "🇰🇷" },
  SG: { code: "SG", name: "Singapore", currency: "SGD", symbol: "S$", multiplier: 2.6, flag: "🇸🇬" },
};

export const JOB_INCOMES: Record<JobType, number> = {
  teacher: 25000,
  waiter: 8000,
  civil_servant: 28000,
  student: 3500,
  custom: 15000,
};

export const JOB_LABELS: Record<JobType, string> = {
  teacher: "Teacher",
  waiter: "Waiter / Service Staff",
  civil_servant: "Civil Servant",
  student: "Student",
  custom: "Custom",
};

export const LIVING_PRESETS: Record<Mode, LivingCosts> = {
  student: {
    rent: 3500,
    groceries: 2000,
    transport: 800,
    electricity: 400,
    airtime: 200,
  },
  worker: {
    rent: 6500,
    groceries: 3500,
    transport: 1500,
    electricity: 800,
    airtime: 350,
  },
  freelancer: {
    rent: 8000,
    groceries: 4000,
    transport: 1200,
    electricity: 1000,
    airtime: 500,
  },
};

export const MODE_PRESETS: Record<Mode, {
  internetCost: number;
  subscriptions: SubscriptionItem[];
  tools: ToolItem[];
  laptopPrice: number;
  laptopMonths: number;
  defaultJobType: JobType;
  defaultIncome: number;
}> = {
  student: {
    internetCost: 599,
    subscriptions: [
      { id: "netflix", name: "Netflix", price: 199, enabled: true },
      { id: "youtube", name: "YouTube Premium", price: 80, enabled: false },
      { id: "spotify", name: "Spotify", price: 60, enabled: true },
      { id: "showmax", name: "Showmax", price: 99, enabled: false },
    ],
    tools: [
      { id: "ms365", name: "Microsoft 365", price: 109, enabled: false },
      { id: "google_one", name: "Google One storage", price: 35, enabled: false },
      { id: "canva", name: "Canva", price: 0, enabled: false },
    ],
    laptopPrice: 8000,
    laptopMonths: 36,
    defaultJobType: "student",
    defaultIncome: 3500,
  },
  worker: {
    internetCost: 799,
    subscriptions: [
      { id: "netflix", name: "Netflix", price: 199, enabled: true },
      { id: "spotify", name: "Spotify", price: 60, enabled: true },
      { id: "showmax", name: "Showmax", price: 99, enabled: false },
      { id: "prime", name: "Prime Video", price: 80, enabled: false },
      { id: "apple_music", name: "Apple Music", price: 70, enabled: false },
    ],
    tools: [
      { id: "ms365", name: "Microsoft 365", price: 109, enabled: false },
      { id: "google_one", name: "Google One storage", price: 35, enabled: false },
      { id: "zoom", name: "Zoom / Meetings", price: 0, enabled: false },
      { id: "canva", name: "Canva", price: 0, enabled: false },
    ],
    laptopPrice: 12000,
    laptopMonths: 36,
    defaultJobType: "civil_servant",
    defaultIncome: 28000,
  },
  freelancer: {
    internetCost: 1299,
    subscriptions: [
      { id: "netflix", name: "Netflix", price: 199, enabled: true },
      { id: "spotify", name: "Spotify", price: 60, enabled: true },
      { id: "chatgpt", name: "ChatGPT", price: 340, enabled: true },
      { id: "adobe", name: "Adobe (avg)", price: 400, enabled: false },
    ],
    tools: [
      { id: "canva", name: "Canva", price: 150, enabled: true },
      { id: "ms365", name: "Microsoft 365", price: 109, enabled: false },
      { id: "hosting", name: "Hosting", price: 200, enabled: true },
      { id: "domains", name: "Domains", price: 50, enabled: true },
    ],
    laptopPrice: 25000,
    laptopMonths: 24,
    defaultJobType: "custom",
    defaultIncome: 35000,
  },
};

export const scaleCurrency = (amount: number, country: Country) => {
  return Math.round(amount * COUNTRIES[country].multiplier);
};

export const convertCurrency = (amount: number, fromCountry: Country, toCountry: Country) => {
  const fromMultiplier = COUNTRIES[fromCountry].multiplier;
  const toMultiplier = COUNTRIES[toCountry].multiplier;

  if (fromMultiplier === toMultiplier) {
    return amount;
  }

  return Math.round((amount / fromMultiplier) * toMultiplier);
};

export const scaleLivingCosts = (costs: LivingCosts, country: Country): LivingCosts => ({
  rent: scaleCurrency(costs.rent, country),
  groceries: scaleCurrency(costs.groceries, country),
  transport: scaleCurrency(costs.transport, country),
  electricity: scaleCurrency(costs.electricity, country),
  airtime: scaleCurrency(costs.airtime, country),
});

export const convertLivingCosts = (
  costs: LivingCosts,
  fromCountry: Country,
  toCountry: Country
): LivingCosts => ({
  rent: convertCurrency(costs.rent, fromCountry, toCountry),
  groceries: convertCurrency(costs.groceries, fromCountry, toCountry),
  transport: convertCurrency(costs.transport, fromCountry, toCountry),
  electricity: convertCurrency(costs.electricity, fromCountry, toCountry),
  airtime: convertCurrency(costs.airtime, fromCountry, toCountry),
});

export const scaleSubscriptions = (items: SubscriptionItem[], country: Country): SubscriptionItem[] =>
  items.map((item) => ({
    ...item,
    price: scaleCurrency(item.price, country),
  }));

export const convertSubscriptions = (
  items: SubscriptionItem[],
  fromCountry: Country,
  toCountry: Country
): SubscriptionItem[] =>
  items.map((item) => ({
    ...item,
    price: convertCurrency(item.price, fromCountry, toCountry),
  }));

export const scaleTools = (items: ToolItem[], country: Country): ToolItem[] =>
  items.map((item) => ({
    ...item,
    price: scaleCurrency(item.price, country),
  }));

export const convertTools = (
  items: ToolItem[],
  fromCountry: Country,
  toCountry: Country
): ToolItem[] =>
  items.map((item) => ({
    ...item,
    price: convertCurrency(item.price, fromCountry, toCountry),
  }));
