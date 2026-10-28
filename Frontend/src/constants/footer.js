import {  FaTwitter,  FaFacebookF,  FaInstagram,  FaLinkedinIn,} from "react-icons/fa";

export const MAIN_FOOTER_CONTENT = {
  /* =================================
     BRAND
  ================================= */

  brand: {
    name: "TrimTokyo",
  },

  /* =================================
     FOOTER COLUMNS
  ================================= */

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
          href: "/career",
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
          label: "Referral Program",
          href: "/referral-program",
        },
      ],
    },

    {
      title: "For Barbers",

      links: [
        {
          label: "Become a Barber",
          href: "/become-barber",
        },
      ],
    },
  ],

  /* =================================
     SOCIAL MEDIA
  ================================= */

  socials: [
    {
      label: "Twitter",
      href: "https://x.com/trimtokyo",
      Icon: FaTwitter,
    },

    {
      label: "Facebook",
      href: "https://www.facebook.com/profile.php?id=61593210549216",
      Icon: FaFacebookF,
    },

    {
      label: "Instagram",
      href: "https://www.instagram.com/trimtokyo?igsh=dXZ6OG5kbDBhM2Nr",
      Icon: FaInstagram,
    },

    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/trim-tokyo-17154642a",
      Icon: FaLinkedinIn,
    },
  ],

  /* =================================
     LEGAL
  ================================= */

  legalLinks: [
    {
      label: "Privacy",
      href: "/privacy",
    },

    {
      label: "Terms",
      href: "/terms",
    },

  ],

  /* =================================
     COPYRIGHT
  ================================= */

  copyright:
    "© 2026 TrimTokyo. All rights reserved.",
};