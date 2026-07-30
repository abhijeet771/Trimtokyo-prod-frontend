import {  LayoutDashboard,  User,  ClipboardList,  CalendarDays,  Globe,  Settings,} from "lucide-react";

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
    icon: User,
    path: "/barber/profile",
  },
 {
    id: "service",
    label: "Service",
    icon: LayoutDashboard,
    path: "/barber/service",
  },
  {
    id: "orders",
    label: "Orders",
    icon: ClipboardList,
    path: "/barber/orders",
  },
  {
    id: "slots",
    label: "Slots",
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
    id: "settings",
    label: "Settings",
    icon: Settings,
    path: "/barber/settings",
  },
];