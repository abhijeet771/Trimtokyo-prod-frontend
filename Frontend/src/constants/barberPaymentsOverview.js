import {
  FileText,
  Wallet,
  Clock3,
  Banknote,
  CreditCard,
  ChartNoAxesColumn,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export const PAYMENT_OVERVIEW_TEXT = {
  title: "Payment Overview",
  summaryTitle: "Payment Summary",
  breakdownTitle: "Payment Method Breakdown",
  statusTitle: "Payment Status",
  totalReceived: "Total Payments Received",
  pendingPayments: "Pending Payments",
  cashReceived: "Cash Received",
  onlinePayments: "Online Payments",
};

export const PAYMENT_DATE_PRESETS = [
  { label: "Last 7 Days", value: "7days" },
  { label: "Last 30 Days", value: "30days" },
  { label: "Last 3 Months", value: "3months" },
];

export const PAYMENT_SUMMARY_CARDS = [
  {
    id: "received",
    title: "Total Payments Received",
    value: 10500,
    description: "12% from last week",
    icon: Wallet,
    accent: "green",
  },
  {
    id: "pending",
    title: "Pending Payments",
    value: 2000,
    description: "Awaiting confirmation",
    icon: Clock3,
    accent: "orange",
  },
  {
    id: "cash",
    title: "Cash Received",
    value: 6200,
    description: "Confirmed cash payments",
    icon: Banknote,
    accent: "teal",
  },
  {
    id: "online",
    title: "Online Payments",
    value: 4800,
    description: "Direct to barber",
    icon: CreditCard,
    accent: "purple",
  },
];

export const PAYMENT_METHOD_BREAKDOWN = [
  {
    id: "cash",
    title: "Cash Payments",
    count: 18,
    amount: 6200,
    percentage: 56,
    icon: Banknote,
    accent: "green",
  },
  {
    id: "online",
    title: "Online Payments",
    count: 14,
    amount: 4800,
    percentage: 44,
    icon: CreditCard,
    accent: "purple",
  },
];

export const PAYMENT_STATUS_CARDS = [
  {
    id: "received",
    title: "Received",
    count: 32,
    amount: 10500,
    icon: CheckCircle2,
    accent: "green",
  },
  {
    id: "pending",
    title: "Pending",
    count: 6,
    amount: 2000,
    icon: Clock3,
    accent: "orange",
  },
  {
    id: "failed",
    title: "Failed",
    count: 2,
    amount: 400,
    icon: XCircle,
    accent: "red",
  },
  {
    id: "refunded",
    title: "Refunded",
    count: 1,
    amount: 500,
    icon: FileText,
    accent: "blue",
  },
];

export const PAYMENT_OVERVIEW_ICONS = {
  summary: FileText,
  breakdown: ChartNoAxesColumn,
  status: Clock3,
};

export const PAYMENT_DATE_RANGE = {
  start: "2026-10-14",
  end: "2026-10-20",
};

export const formatPaymentCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
