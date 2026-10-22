import {
  LayoutDashboard,
  UserRound,
  UsersRound,
  Scissors,
  ClipboardList,
  CalendarDays,
  Globe,
  ChartNoAxesCombined,
  Wallet,
  CreditCard,
  Receipt,
  Headset,
  Settings,
} from "lucide-react";

export const BARBER_SIDEBAR_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/barber/dashboard",
  },
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
    path: "/barber/profile",
  },
  {
    id: "service",
    label: "Services",
    icon: Scissors,
    path: "/barber/service",
  },
   {
  id: "staff",
  label: "Staff",
  icon: UsersRound,
  path: "/barber/staff",
},
  {
    id: "orders",
    label: "Orders",
    icon: ClipboardList,
    path: "/barber/orders",
  },
  {
    id: "slots",
    label: "Slots & Schedule",
    icon: CalendarDays,
    path: "/barber/slots",
  },
  {
    id: "website",
    label: "Brand Website",
    icon: Globe,
    path: "/barber/website",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: ChartNoAxesCombined,
    path: "/barber/analytics",
  },
  {
    id: "earnings",
    label: "Earnings",
    icon: Wallet,
    children: [
      {
        id: "earnings-overview",
        label: "Overview",
        icon: ChartNoAxesCombined,
        path: "/barber/earnings",
      },
      {
        id: "earnings-payments-overview",
        label: "Payments Overview",
        icon: LayoutDashboard,
        path: "/barber/earnings/payments/overview",
      },
      {
        id: "earnings-payments",
        label: "Payments Table",
        icon: CreditCard,
        path: "/barber/earnings/payments",
      },
      {
        id: "earnings-expenditure",
        label: "Expenditure",
        icon: Receipt,
        path: "/barber/earnings/expenditure",
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    icon: Headset,
    path: "/barber/support",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/barber/settings",
  },
];