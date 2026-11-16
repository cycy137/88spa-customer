// src/data/testimonials.js
// Single source of truth for the guest testimonials.
// Used by the Reviews component and by the build-time prerender script
// (scripts/prerender.mjs), so the static HTML search engines see always
// matches the live site. Edit testimonials here only.

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Redmond, WA",
    rating: 5,
    text: "The best head spa experience in the Eastside! The scalp analysis was eye-opening and the massage was so relaxing I fell asleep instantly. Will absolutely come back every month."
  },
  {
    id: 2,
    name: "David K.",
    location: "Bellevue, WA",
    rating: 5,
    text: "Outstanding deep tissue massage. The therapists really understand muscle tension. Clean private rooms, easy parking, and very professional team. Highly recommend 88 Spa."
  },
  {
    id: 3,
    name: "Elena R.",
    location: "Kirkland, WA",
    rating: 5,
    text: "Absolute heaven. The combination of the warm waterfall ring, aromatherapy, and shoulder massage completely melted my work week stress away. A hidden gem in Redmond!"
  }
];
