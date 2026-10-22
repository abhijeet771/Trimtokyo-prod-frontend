export const SUPPORT_TICKET_TABLE_TEXT = {
  title: "My Support Tickets",
  subtitle: "Track and manage the support issues you have raised.",
  searchPlaceholder: "Search by ticket ID, title or category...",
  statusLabel: "Status",
  priorityLabel: "Priority",
  reset: "Reset Filters",
  emptyTitle: "No tickets found",
  emptyDescription: "Try changing your search or filters.",
};

export const SUPPORT_TICKET_STATUS_OPTIONS = [
  { label: "All Statuses", value: "all" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in-progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

export const SUPPORT_TICKET_PRIORITY_OPTIONS = [
  { label: "All Priorities", value: "all" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

export const SUPPORT_TICKET_PAGE_SIZE = 5;

// Illustrative data. Replace with API results when the backend is ready.
export const SUPPORT_TICKET_RECORDS = [
  {
    id: "TKT-1001",
    title: "Unable to update profile photo",
    category: "Account & Profile",
    date: "2026-10-20",
    priority: "high",
    status: "open",
  },
  {
    id: "TKT-1002",
    title: "Payment not reflected in earnings",
    category: "Payments & Earnings",
    date: "2026-10-19",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "TKT-1003",
    title: "Unable to update available slots",
    category: "Bookings & Slots",
    date: "2026-10-18",
    priority: "medium",
    status: "open",
  },
  {
    id: "TKT-1004",
    title: "Service description correction",
    category: "Orders & Services",
    date: "2026-10-17",
    priority: "low",
    status: "resolved",
  },
  {
    id: "TKT-1005",
    title: "Salon website image not loading",
    category: "Website & CMS",
    date: "2026-10-16",
    priority: "medium",
    status: "in-progress",
  },
  {
    id: "TKT-1006",
    title: "Login verification issue",
    category: "Account & Profile",
    date: "2026-10-15",
    priority: "high",
    status: "resolved",
  },
  {
    id: "TKT-1007",
    title: "Incorrect order notification",
    category: "Orders & Services",
    date: "2026-10-14",
    priority: "low",
    status: "closed",
  },
  {
    id: "TKT-1008",
    title: "Booking schedule not refreshing",
    category: "Bookings & Slots",
    date: "2026-10-13",
    priority: "medium",
    status: "open",
  },
  {
    id: "TKT-1009",
    title: "Earnings report discrepancy",
    category: "Payments & Earnings",
    date: "2026-10-12",
    priority: "high",
    status: "in-progress",
  },
  {
    id: "TKT-1010",
    title: "Website contact details update",
    category: "Website & CMS",
    date: "2026-10-11",
    priority: "low",
    status: "resolved",
  },
];

export const formatSupportTicketDate = (dateString) =>
  new Date(`${dateString}T12:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const SUPPORT_TICKET_STATUS_LABELS = {
  open: "Open",
  "in-progress": "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const SUPPORT_TICKET_PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
};
