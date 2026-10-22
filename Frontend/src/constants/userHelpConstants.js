export const HELP_ISSUE_TYPES = [
  { label: "Select issue type", value: "" },
  { label: "Booking Issue", value: "Booking Issue" },
  { label: "Payment Issue", value: "Payment Issue" },
  { label: "Service Issue", value: "Service Issue" },
  { label: "Account Issue", value: "Account Issue" },
  { label: "App / Website Issue", value: "App / Website Issue" },
  { label: "Refund Request", value: "Refund Request" },
  { label: "Other", value: "Other" },
];

export const HELP_PRIORITY_OPTIONS = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

export const HELP_STATUS_OPTIONS = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
};

export const HELP_PRIORITY_CLASS = {
  High: "high",
  Medium: "medium",
  Low: "low",
};

export const HELP_STATUS_CLASS = {
  Open: "open",
  "In Progress": "in-progress",
  Resolved: "resolved",
};

export const INITIAL_HELP_REQUESTS = [
  {
    id: "TT-1024",
    issue: "Booking confirmation not received",
    issueType: "Booking Issue",
    priority: "High",
    description:
      "My booking was submitted successfully, but I have not received confirmation.",
    status: "In Progress",
    createdAt: "2026-10-18T10:30:00",
  },
  {
    id: "TT-1023",
    issue: "Payment status not updated",
    issueType: "Payment Issue",
    priority: "Medium",
    description:
      "The payment was completed, but the order still shows a pending payment status.",
    status: "Open",
    createdAt: "2026-10-17T14:15:00",
  },
  {
    id: "TT-1022",
    issue: "Unable to update profile details",
    issueType: "Account Issue",
    priority: "Low",
    description:
      "I am unable to save my updated profile information.",
    status: "Resolved",
    createdAt: "2026-10-15T09:45:00",
  },
];
