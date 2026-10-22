export const PAYMENT_TABLE_TEXT = {
  title: "Payments Table",
  subtitle: "Manage and track all payment records",
  searchPlaceholder: "Search payment, order or customer...",
  statusLabel: "Payment status",
  methodLabel: "Payment method",
  allStatuses: "All",
  allMethods: "All methods",
  reset: "Reset",
  paymentsFound: "payments found",
  page: "Page",
  of: "of",
  emptyTitle: "No payments found",
  emptyDescription:
    "Try changing your search or filters to find payments.",
};

export const PAYMENT_STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Received", value: "received" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

export const PAYMENT_METHOD_OPTIONS = [
  { label: "All methods", value: "all" },
  { label: "Cash", value: "cash" },
  { label: "Online", value: "online" },
];

export const PAYMENT_TABLE_RECORDS = [
  {
    id: "PAY1001",
    orderId: "TT1001",
    customer: "Amit Shah",
    date: "2026-10-20",
    time: "02:30 PM",
    method: "cash",
    amount: 800,
    status: "received",
  },
  {
    id: "PAY1002",
    orderId: "TT1002",
    customer: "Priya Mehta",
    date: "2026-10-20",
    time: "01:15 PM",
    method: "online",
    amount: 1200,
    status: "pending",
  },
  {
    id: "PAY1003",
    orderId: "TT1003",
    customer: "Rahul Verma",
    date: "2026-10-19",
    time: "11:45 AM",
    method: "cash",
    amount: 500,
    status: "received",
  },
  {
    id: "PAY1004",
    orderId: "TT1004",
    customer: "Neha Singh",
    date: "2026-10-19",
    time: "10:00 AM",
    method: "online",
    amount: 900,
    status: "received",
  },
  {
    id: "PAY1005",
    orderId: "TT1005",
    customer: "Karan Trivedi",
    date: "2026-10-18",
    time: "06:20 PM",
    method: "online",
    amount: 650,
    status: "failed",
  },
  {
    id: "PAY1006",
    orderId: "TT1006",
    customer: "Sneha Kapoor",
    date: "2026-10-18",
    time: "04:10 PM",
    method: "cash",
    amount: 700,
    status: "received",
  },
  {
    id: "PAY1007",
    orderId: "TT1007",
    customer: "Arjun Patel",
    date: "2026-10-17",
    time: "12:30 PM",
    method: "online",
    amount: 1500,
    status: "refunded",
  },
  {
    id: "PAY1008",
    orderId: "TT1008",
    customer: "Riya Sharma",
    date: "2026-10-16",
    time: "09:45 AM",
    method: "cash",
    amount: 450,
    status: "pending",
  },
];

export const PAYMENT_TABLE_PAGE_SIZE = 5;

export const formatTableCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatTableDate = (dateString) =>
  new Date(`${dateString}T12:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
