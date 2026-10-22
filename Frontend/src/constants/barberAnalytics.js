export const ANALYTICS_PERIODS = [
  { label: "Last 7 Days", value: "7" },
  { label: "Last 30 Days", value: "30" },
  { label: "Last 90 Days", value: "90" },
];

export const ANALYTICS_KPIS = [
  {
    id: "earnings",
    label: "Total Earnings",
    value: "₹12,500",
    change: "+12%",
    description: "Compared to previous period",
    icon: "Wallet",
    accent: "purple",
  },
  {
    id: "orders",
    label: "Total Orders",
    value: "40",
    change: "+10%",
    description: "Compared to previous period",
    icon: "ShoppingBag",
    accent: "blue",
  },
  {
    id: "customers",
    label: "Unique Customers",
    value: "28",
    change: "+7%",
    description: "Compared to previous period",
    icon: "Users",
    accent: "green",
  },
  {
    id: "average-order",
    label: "Avg. Earnings per Order",
    value: "₹312",
    change: "+8%",
    description: "Compared to previous period",
    icon: "Receipt",
    accent: "orange",
  },
  {
    id: "services",
    label: "Avg. Services per Customer",
    value: "2.1",
    change: "+5%",
    description: "Compared to previous period",
    icon: "Scissors",
    accent: "pink",
  },
  {
    id: "daily-average",
    label: "Average Daily Earnings",
    value: "₹1,786",
    change: "+9%",
    description: "Compared to previous period",
    icon: "TrendingUp",
    accent: "indigo",
  },
];

export const ANALYTICS_EARNINGS_BY_DAY = [
  { day: "14 Oct", shortDay: "14", earnings: 800 },
  { day: "15 Oct", shortDay: "15", earnings: 1400 },
  { day: "16 Oct", shortDay: "16", earnings: 1200 },
  { day: "17 Oct", shortDay: "17", earnings: 2100 },
  { day: "18 Oct", shortDay: "18", earnings: 1700 },
  { day: "19 Oct", shortDay: "19", earnings: 2500 },
  { day: "20 Oct", shortDay: "20", earnings: 2200 },
];

export const ANALYTICS_SERVICE_EARNINGS = [
  {
    name: "Haircut",
    amount: 5000,
    percentage: 40,
    color: "#6954e8",
  },
  {
    name: "Beard Trim",
    amount: 2750,
    percentage: 22,
    color: "#4d91ed",
  },
  {
    name: "Haircut + Beard",
    amount: 2250,
    percentage: 18,
    color: "#f5a13b",
  },
  {
    name: "Hair Styling",
    amount: 1500,
    percentage: 12,
    color: "#20b486",
  },
  {
    name: "Other Services",
    amount: 1000,
    percentage: 8,
    color: "#a4adbf",
  },
];

export const ANALYTICS_CUSTOMER_METRICS = [
  {
    id: "orders",
    label: "Total Orders",
    value: "40",
    change: "10%",
    icon: "ChartColumn",
    accent: "purple",
  },
  {
    id: "customers",
    label: "Unique Customers",
    value: "28",
    change: "7%",
    icon: "Users",
    accent: "blue",
  },
  {
    id: "services",
    label: "Avg. Services per Customer",
    value: "2.1",
    change: null,
    icon: "UsersRound",
    accent: "orange",
  },
  {
    id: "average-earnings",
    label: "Avg. Earnings per Order",
    value: "₹312",
    change: "8%",
    icon: "Receipt",
    accent: "purple",
  },
];

export const ANALYTICS_DATE_RANGE = {
  start: "14 Oct 2026",
  end: "20 Oct 2026",
};
