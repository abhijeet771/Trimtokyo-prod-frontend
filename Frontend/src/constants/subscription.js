export const SUBSCRIPTION_CONTENT = {
  badge: "PREMIUM SUBSCRIPTIONS",
  title: {
    line1: "Groom More.",
    highlight: "Save More.",
  },
  subtitle: "Exclusive grooming plans for a smarter, sharper you.",

  plans: [
    {
      id: "monthly",
      name: "Monthly Plan",
      duration: "1 Month",
      durationMonths: 1,
      price: 299,
      originalPrice: null,
      priceLabel: "/ month",
      description: "Stay fresh, every month.",
      theme: "red",
      popular: false,
      savings: null,

      features: [
        "2 haircuts per month",
        "Beard trim included",
        "10% off on all other services",
        "Priority booking",
      ],

      buttonText: "Choose Monthly Plan",
    },

    {
      id: "three-months",
      name: "3 Months Plan",
      duration: "3 Months",
      durationMonths: 3,
      price: 1299,
      originalPrice: 1497,
      priceLabel: "for 3 months",
      description: "More grooming. More savings.",
      theme: "blue",
      popular: true,
      savings: {
        amount: 198,
        percentage: 13,
        label: "Save ₹198 (13%)",
      },

      features: [
        "6 haircuts (2 per month)",
        "Beard trim included",
        "15% off on all other services",
        "Priority booking",
        "Exclusive member offers",
      ],

      buttonText: "Choose 3 Months Plan",
    },

    {
      id: "six-months",
      name: "6 Months Plan",
      duration: "6 Months",
      durationMonths: 6,
      price: 2299,
      originalPrice: 2994,
      priceLabel: "for 6 months",
      description: "Best value for regular grooming.",
      theme: "green",
      popular: false,
      savings: {
        amount: 695,
        percentage: 23,
        label: "Save ₹695 (23%)",
      },

      features: [
        "12 haircuts (2 per month)",
        "Beard trim included",
        "20% off on all other services",
        "Priority booking",
        "Exclusive member offers",
        "Free add-on service (e.g. Hair Spa or Facial)",
      ],

      buttonText: "Choose 6 Months Plan",
    },
  ],
};
