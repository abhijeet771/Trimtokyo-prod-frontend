
export const OPTIONAL_SECTION_CONTENT = {
  title: "Choose Your Grooming Experience",

  subtitle:
    "Book a grooming service at home or reserve your slot at a salon.",

  tabs: {
    homeService: {
      label: "Home Service",

      items: [
        {
          id: 1,
          name: "Sara D-Tan",
          image: "/optional/homeService/h1.png",
          avgPrice: 449,
        },
        {
          id: 2,
          name: "Full Leg Rica Waxing",
          image: "/optional/homeService/h2.png",
          avgPrice: 719,
        },
        {
          id: 3,
          name: "Classic Clean-Up",
          image: "/optional/homeService/h3.png",
          avgPrice: 869,
        },
        {
          id: 4,
          name: "Advance Manicure",
          image: "/optional/homeService/h4.png",
          avgPrice: 699,
        },
        {
          id: 5,
          name: "Hair Spa",
          image: "/optional/homeService/h5.png",
          avgPrice: 1599,
        },
      ],
    },

    slotBooking: {
      label: "Slot Booking",

      items: [
        {
          id: 1,
          name: "Try haircut at mannat",
          image: "/optional/slotBooking/s1.png",
          avgPrice: 79,
          slug: "mannat-unisex-salon",
        },
        {
          id: 2,
          name: "Groom your beard",
          image: "/optional/slotBooking/s2.png",
          avgPrice: 99,
          slug: "aesthetic-unisex-salon",
        },
        {
          id: 3,
          name: "Open 10 to 5",
          image: "/optional/slotBooking/s3.png",
          avgPrice: 49,
          slug: "royal-gents-salon",
        },
        {
          id: 4,
          name: "Try new styles",
          image: "/optional/slotBooking/s4.png",
          avgPrice: 99,
          slug: "studio99-salon",
        },
      ],
    },
  },
};
