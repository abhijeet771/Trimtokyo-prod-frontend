export const EVENT_STATUS_CONFIG = [
  {
    key: "Pending",
    label: "Pending",
    description: "Awaiting confirmation",
    color: "#3985f5",
  },
  {
    key: "Confirmed",
    label: "Confirmed",
    description: "Approved bookings",
    color: "#36a269",
  },
  {
    key: "Completed",
    label: "Completed",
    description: "Successfully completed",
    color: "#8b5cf6",
  },
  {
    key: "Cancelled",
    label: "Cancelled",
    description: "Cancelled bookings",
    color: "#ed6262",
  },
];

export const getEventStatusStats = (bookings = []) => {
  const total = bookings.length;

  return EVENT_STATUS_CONFIG.map((status) => {
    const count = bookings.filter(
      (booking) => booking.status === status.key
    ).length;

    return {
      ...status,
      count,
      percentage:
        total > 0
          ? Number(((count / total) * 100).toFixed(1))
          : 0,
    };
  });
};
