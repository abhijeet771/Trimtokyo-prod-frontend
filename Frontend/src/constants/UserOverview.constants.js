
import {
  ShoppingCart,
  CalendarCheck,
  Package,
  Bell,
} from "lucide-react";

export const OVERVIEW_STATS = [
  {
    key: "cart",
    label: "Items in Cart",
    description: "Services ready to book",
    icon: ShoppingCart,
    color: "blue",
    value: 0,
    action: "cart",
  },
  {
    key: "bookings",
    label: "Upcoming Bookings",
    description: "Confirmed appointments",
    icon: CalendarCheck,
    color: "green",
    value: 0,
    action: "bookings",
  },
  {
    key: "orders",
    label: "Total Orders",
    description: "Your order history",
    icon: Package,
    color: "orange",
    value: 0,
    action: "orders",
  },
  {
    key: "notifications",
    label: "Unread Notifications",
    description: "New updates",
    icon: Bell,
    color: "purple",
    value: 0,
    action: "notifications",
  },
];

export const OVERVIEW_BOOKINGS = [
  {
    id: "booking-1",
    salon: "Naturica Unisex Salon",
    service: "Haircut + Beard Styling",
    date: "12 Mar 2025",
    time: "11:30 AM",
    barber: "Rohit Sharma",
    status: "Confirmed",
    image: "",
  },
  {
    id: "booking-2",
    salon: "The Gentlemen's Hub",
    service: "Hair Spa Treatment",
    date: "15 Mar 2025",
    time: "04:00 PM",
    barber: "Amit Verma",
    status: "Scheduled",
    image: "",
  },
];

export const OVERVIEW_ORDERS = [
  {
    id: "order-1",
    name: "Classic Haircut",
    services: "1 service",
    price: 250,
    date: "08 Mar 2025",
    status: "Completed",
    image: "",
  },
  {
    id: "order-2",
    name: "Beard Styling",
    services: "1 service",
    price: 150,
    date: "25 Feb 2025",
    status: "Completed",
    image: "",
  },
  {
    id: "order-3",
    name: "Hair Spa Treatment",
    services: "1 service",
    price: 499,
    date: "10 Feb 2025",
    status: "Cancelled",
    image: "",
  },
];

export const PROFILE_COMPLETION_FIELDS = [
  "name",
  "email",
  "phone",
  "avatar",
  "address",
];

export const OVERVIEW_PROMO = {
  eyebrow: "EXPLORE MORE SERVICES",
  title: "Find the perfect grooming service",
  description:
    "Discover top-rated salons and professional barbers near you.",
  buttonText: "Browse Services",
  route: "/search",
};
