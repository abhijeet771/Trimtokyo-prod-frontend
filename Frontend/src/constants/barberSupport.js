
import {
  Ticket,
  CircleDot,
  Clock3,
  CheckCircle2,
} from "lucide-react";

export const SUPPORT_TABS = [
  { label: "Raise a Ticket", value: "raise" },
  { label: "My Tickets", value: "tickets" },
];

export const SUPPORT_KPIS = [
  {
    id: "raised",
    label: "Raised Tickets",
    value: 12,
    icon: Ticket,
    accent: "purple",
    description: "Total tickets submitted",
  },
  {
    id: "open",
    label: "Open Tickets",
    value: 4,
    icon: CircleDot,
    accent: "blue",
    description: "Awaiting review",
  },
  {
    id: "progress",
    label: "In Progress",
    value: 3,
    icon: Clock3,
    accent: "orange",
    description: "Currently being handled",
  },
  {
    id: "resolved",
    label: "Resolved",
    value: 5,
    icon: CheckCircle2,
    accent: "green",
    description: "Successfully completed",
  },
];

export const SUPPORT_CATEGORIES = [
  { label: "Select issue category", value: "" },
  { label: "Account & Profile", value: "account" },
  { label: "Bookings & Slots", value: "bookings" },
  { label: "Orders & Services", value: "orders" },
  { label: "Payments & Earnings", value: "payments" },
  { label: "Website & CMS", value: "website" },
  { label: "Technical Issue", value: "technical" },
  { label: "Other", value: "other" },
];

export const SUPPORT_PRIORITIES = [
  { label: "Select priority", value: "" },
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const SUPPORT_FORM_INITIAL_STATE = {
  title: "",
  category: "",
  description: "",
  priority: "",
  attachment: null,
};