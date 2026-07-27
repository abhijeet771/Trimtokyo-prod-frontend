// src/constants/footer.js

import {
  FaTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export const MAIN_FOOTER_CONTENT = {
  brand: {
    name: "TrimTokyo",

    description:
      "India’s modern barber & salon booking platform for premium grooming services at salons or at home.",
  },

  columns: [
    {
      title: "Company",

      links: [
        {
          label: "About Us",
          href: "/about",
        },

        {
          label: "Blog",
          href: "/blog",
        },

        {
          label: "Careers",
          href: "/careers",
        },

        {
          label: "Press",
          href: "/press",
        },
      ],
    },

    {
      title: "Support",

      links: [
        {
          label: "Contact Us",
          href: "/contact",
        },

        {
          label: "Help Center",
          href: "/help",
        },

        {
          label: "FAQs",
          href: "/faqs",
        },

        {
          label: "Cancellation Policy",
          href: "/cancellation-policy",
        },
      ],
    },

    {
      title: "For Barbers",

      links: [
        {
          label: "Become a Barber",
          href: "/become-a-barber",
        },

        {
          label: "Partner Program",
          href: "/partner-program",
        },

        {
          label: "Barber Dashboard",
          href: "/barber-dashboard",
        },

        {
          label: "Business Support",
          href: "/business-support",
        },
      ],
    },

    {
      title: "Legal",

      links: [
        {
          label: "Privacy Policy",
          href: "/privacy",
        },

        {
          label: "Terms of Service",
          href: "/terms",
        },

        {
          label: "Refund Policy",
          href: "/refund-policy",
        },

        {
          label: "Cookies Policy",
          href: "/cookies",
        },
      ],
    },
  ],

  socials: [
    {
      label: "Twitter",
      href: "https://twitter.com",
      Icon: FaTwitter,
    },

    {
      label: "Facebook",
      href: "https://facebook.com",
      Icon: FaFacebookF,
    },

    {
      label: "Instagram",
      href: "https://instagram.com",
      Icon: FaInstagram,
    },

    {
      label: "LinkedIn",
      href: "https://linkedin.com",
      Icon: FaLinkedinIn,
    },
  ],

  legalLinks: [
    {
      label: "Privacy",
      href: "/privacy",
    },

    {
      label: "Terms",
      href: "/terms",
    },

    {
      label: "Cookies",
      href: "/cookies",
    },
  ],

  copyright:
    "© 2026 TrimTokyo. All rights reserved.",
};