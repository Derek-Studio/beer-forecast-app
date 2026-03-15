export const SUMMARY = {
  condition: "🌩️ Heavy Discounts",
  headline: "Thirsty Thursday",
  subline:
    "Happy hour front rolling in from SE1. Expect 4 active deals peaking around 8pm. Bring cash and low expectations.",
  peakTime: "8pm",
};

export type HourlySlot = {
  time: string;
  emoji: string;
  label: string;
  deal: string;
};

export const HOURLY: HourlySlot[] = [
  { time: "5PM", emoji: "🍺", label: "Pint", deal: "£4" },
  { time: "6PM", emoji: "🍺", label: "Happy Hour", deal: "£3.50" },
  { time: "7PM", emoji: "🍻", label: "Pitcher", deal: "£12" },
  { time: "8PM", emoji: "🍷", label: "Wine", deal: "£6" },
  { time: "9PM", emoji: "🍸", label: "Cocktail", deal: "£8" },
  { time: "10PM", emoji: "🥃", label: "Whisky", deal: "£5" },
  { time: "11PM", emoji: "🥂", label: "Prosecco", deal: "£7" },
  { time: "12AM", emoji: "💧", label: "Water", deal: "free" },
];

export type ForecastDay = {
  day: string;
  emoji: string;
  dealCount: number;
  intensity: number; // 1–5
  blurb: string;
};

export const FORECAST: ForecastDay[] = [
  { day: "Today", emoji: "🍺", dealCount: 4, intensity: 4, blurb: "Heavy shower of happy hours, mainly SE London" },
  { day: "Tue", emoji: "🍷", dealCount: 2, intensity: 2, blurb: "Patchy wine deals, cloudy with a chance of rosé" },
  { day: "Wed", emoji: "🍸", dealCount: 3, intensity: 3, blurb: "Cocktail front moving in from the West End" },
  { day: "Thu", emoji: "🍻", dealCount: 5, intensity: 5, blurb: "Storm of promos. Do not operate heavy machinery" },
  { day: "Fri", emoji: "🥂", dealCount: 4, intensity: 4, blurb: "Prosecco pressure system. Bring a designated driver" },
  { day: "Sat", emoji: "🍺", dealCount: 3, intensity: 3, blurb: "Scattered pints, mild chance of kebab after" },
  { day: "Sun", emoji: "🥃", dealCount: 1, intensity: 1, blurb: "Isolated whisky deal. High chance of regret" },
  { day: "Mon", emoji: "💧", dealCount: 0, intensity: 0, blurb: "Dry. Depressingly, genuinely dry." },
  { day: "Tue", emoji: "🍺", dealCount: 2, intensity: 2, blurb: "Low pressure pint system returning from the east" },
  { day: "Wed", emoji: "🍷", dealCount: 2, intensity: 2, blurb: "Overcast with periodic wine windows" },
  { day: "Thu", emoji: "🍻", dealCount: 4, intensity: 4, blurb: "Another Thirsty Thursday. Surprisingly" },
  { day: "Fri", emoji: "🍸", dealCount: 3, intensity: 3, blurb: "Cocktail conditions improving through the evening" },
  { day: "Sat", emoji: "🥂", dealCount: 3, intensity: 3, blurb: "Bubbly outlook. Pack an umbrella anyway" },
  { day: "Sun", emoji: "🍺", dealCount: 1, intensity: 1, blurb: "One lonely pint deal. Cherish it." },
];
