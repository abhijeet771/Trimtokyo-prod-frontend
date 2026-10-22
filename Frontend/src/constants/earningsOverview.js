import {
  Wallet,
  CalendarDays,
  ChartNoAxesColumn,
  CalendarRange,
} from "lucide-react";

export const EARNINGS_TEXT = {
  title: "Earnings",
  subtitle: "Track your income, payments and expenses",
  overviewTitle: "Earnings Overview",
  trendTitle: "Earnings Trend",
  dateRangeLabel: "Date range",

  cards: [
    {
      id: "total",
      title: "Total Earnings",
      icon: Wallet,
      accent: "green",
      value: 12500,
      change: 12,
      description: "Total earnings recorded",
    },
    {
      id: "today",
      title: "Today's Earnings",
      icon: CalendarDays,
      accent: "purple",
      value: 1200,
      change: 8,
      description: "Compared with previous period",
    },
    {
      id: "week",
      title: "This Week's Earnings",
      icon: ChartNoAxesColumn,
      accent: "orange",
      value: 5800,
      change: 15,
      description: "Compared with previous period",
    },
    {
      id: "month",
      title: "This Month's Earnings",
      icon: CalendarRange,
      accent: "blue",
      value: 18400,
      change: 20,
      description: "Compared with previous period",
    },
  ],
};

export const EARNINGS_PERIODS = [
  { label: "7 Days", value: "7days" },
  { label: "30 Days", value: "30days" },
  { label: "3 Months", value: "3months" },
];

export const EARNINGS_CHART_DATA = {
  "7days": [
    { label: "Mon", earnings: 850 },
    { label: "Tue", earnings: 1200 },
    { label: "Wed", earnings: 950 },
    { label: "Thu", earnings: 1800 },
    { label: "Fri", earnings: 1400 },
    { label: "Sat", earnings: 2600 },
    { label: "Sun", earnings: 2100 },
  ],

  "30days": [
    { label: "Week 1", earnings: 8200 },
    { label: "Week 2", earnings: 10500 },
    { label: "Week 3", earnings: 9400 },
    { label: "Week 4", earnings: 12800 },
  ],

  "3months": [
    { label: "Aug", earnings: 32000 },
    { label: "Sep", earnings: 38500 },
    { label: "Oct", earnings: 42000 },
  ],
};

export const EARNINGS_DATE_PRESETS = [
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 3 Months", value: "3months" },
];