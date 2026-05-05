type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type SonkeChatContext = {
  countryName: string;
  currencySymbol: string;
  monthlyIncome: number;
  totalExpenses: number;
  difference: number;
  totalLiving: number;
  totalDigital: number;
};

type ChatRequest = {
  messages: ChatMessage[];
  context: SonkeChatContext;
};

const deficitActions = (absGap: number, sym: string) => {
  if (absGap <= 1500) {
    return `For a shortfall around ${sym}${absGap.toLocaleString()}, look at small freelancing, selling what you do not use, or a few hours of part-time work.`;
  }
  if (absGap <= 4000) {
    return `A gap of ${sym}${absGap.toLocaleString()} usually needs steadier work: 5–10 hours a week freelancing, an entry remote role, or a side you can repeat monthly.`;
  }
  return `A gap of ${sym}${absGap.toLocaleString()} is serious. Plan two income lines (not one “big win”), cut the largest recurring costs, and build a few months of buffer.`;
};

export const sonkeChatFallback = (body: ChatRequest) => {
  const { currencySymbol: sym, monthlyIncome, totalExpenses, difference, totalLiving, totalDigital } = body.context;
  const biggestArea = totalLiving >= totalDigital ? "living costs (rent, food, transport, power, data)" : "digital costs (internet, tools, subs, device)";
  const lastUserMessage = [...body.messages].reverse().find((message) => message.role === "user")?.content ?? "";
  const normalized = lastUserMessage.toLowerCase().trim();
  const userIntent = lastUserMessage.trim();
  const absGap = Math.abs(difference);
  const prevAssistantMessage =
    [...body.messages].reverse().find((message) => message.role === "assistant")?.content ?? "";

  if (/^(hi|hello|hey|howzit|sawubona|molo|yo|sup)\b/.test(normalized)) {
    return "Hey. I am Sonke. I can chat normally, and I am most useful when you want to check affordability, what to cut first, or how to close a monthly gap. Want a quick read of your current numbers?";
  }

  if (/(how are you|how r you|how're you|hows it going|what'?s up|wyd)/.test(normalized)) {
    return "I am good, thanks. I am here and ready to help. If you want, I can give a quick 30-second read of your budget pressure right now.";
  }

  if (/(thanks|thank you|appreciate it|nice one|sharp)/.test(normalized)) {
    return "You are welcome. If you want a next step, I can suggest one action to cut costs and one action to increase income this month.";
  }

  if (/^(yes|yep|yeah|ok|okay|sure|go ahead|do it)\b/.test(normalized)) {
    if (difference < 0) {
      return `Quick read: you are short ${sym}${absGap.toLocaleString()} this month. First cut one non-essential recurring cost, then add one repeatable income action this week. ${deficitActions(absGap, sym)}`;
    }
    return `Quick read: you currently have ${sym}${difference.toLocaleString()} left after expenses. Protect that by moving a fixed share to savings first, then review your biggest cost bucket once this week.`;
  }

  if (/(no|not now|later)\b/.test(normalized) && /quick read|30-second read/.test(prevAssistantMessage.toLowerCase())) {
    return "No problem. When you are ready, ask me things like “what should I cut first?”, “can I survive this month?”, or “how big is my gap?”";
  }

  if (normalized.includes("who are you") || normalized.includes("what can you do") || normalized.includes("what is sonke")) {
    return "I am Sonke: a practical money mirror. I use the figures on this page to talk about your budget, income pressure, and next steps—no hype, no promises of quick riches.";
  }

  if (/\binternet rent\b|digital life|cost of living/.test(normalized)) {
    return "“Internet rent” is everything you pay to live and work online: data or fibre, software, subs, and your share of a device. Here your digital total is " +
      `${sym}${totalDigital.toLocaleString()} vs ${sym}${totalLiving.toLocaleString()} for day-to-day living.`;
  }

  if (/(cut|remove|stop|cancel|first|should i)/.test(normalized) && /(sub|subscription|netflix|spotify|stream)/.test(normalized)) {
    return "Start with subs you have not opened in two weeks. Pause one for 30 days, then decide. Small amounts add up when you are close to the line.";
  }

  if (/(cut|reduce|save|lower)/.test(normalized) || /what should i cut/.test(normalized)) {
    return `Biggest weight is usually ${biggestArea}. List your top three monthly costs, then change the largest one you can actually negotiate (rent/housemate, transport pattern, or one bundled internet plan)—not only coffee.`;
  }

  if (/survive|make it|this month|afford/.test(normalized)) {
    if (difference < 0) {
      return `With income ${sym}${monthlyIncome.toLocaleString()} and spend ${sym}${totalExpenses.toLocaleString()}, you are short ${sym}${absGap.toLocaleString()}. Protect rent and food first, freeze one subscription, then ${deficitActions(absGap, sym)}`;
    }
    return `On these numbers you have ${sym}${difference.toLocaleString()} left after ${sym}${totalExpenses.toLocaleString()}. That can work if surprises are small—keep a buffer and avoid adding new recurring costs.`;
  }

  if (/(student|varsity|res|room)/.test(normalized)) {
    return "Student-style months often land around R4k–R7k all-in (SA example), but your form may differ. Share costs where you can, use free tools, and add a small steady income if you can without breaking your course.";
  }

  if (/(remote|freelance|work from home)/.test(normalized)) {
    return "Remote work means internet and tools are not optional. Compare your digital total to your living total—if tools are heavy, pick one core stack and drop duplicates. Track subs every quarter.";
  }

  if (difference < 0) {
    return `You are short by ${sym}${absGap.toLocaleString()} this month (income ${sym}${monthlyIncome.toLocaleString()} vs spend ${sym}${totalExpenses.toLocaleString()}). Tackle ${biggestArea} first, pause one non-essential subscription, then ${deficitActions(absGap, sym)}`;
  }

  if (normalized.length <= 10 || !/[0-9]|budget|cost|income|rent|subscription|afford|save|cut|expense/.test(normalized)) {
    return "I can definitely chat. If you want budget help, tell me one thing: do you want to cut costs, increase income, or check if this month is affordable?";
  }

  return `On your question "${userIntent}", here is the practical read: you have ${sym}${difference.toLocaleString()} left after ${sym}${totalExpenses.toLocaleString()} in expenses. Set aside part of that before spending, and review ${biggestArea} first; big buckets move results fastest.`;
};

export const SONKE_SYSTEM_PROMPT = `You are Sonke, inside a web app for “real cost of living + digital life,” with a South Africa-first lens (ZAR, local examples) and global respect.

Behaviours:
- Be practical, honest, and short. Realistic ranges, not exact claims. No hype; no “get rich quick.”
- Use the user’s profile numbers when they ask about money. Default currency from context.
- Students, teachers, waiters, civil servants, freelancers, and remote workers are common—match tone to everyday life.
- You may answer greetings and small talk naturally, then steer to budget when relevant.
- If user asks normal conversation (e.g. "how are you"), answer naturally first, then offer one useful budgeting next step.
- No legal, tax, or investment advice. No medical advice.
- Keep replies under 120 words unless the user asks for a list. Use simple bullets when it helps.
- Speak like a real human coach, not a scripted bot.`;
