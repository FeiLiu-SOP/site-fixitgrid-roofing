/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}"],
  // Domain-specific fingerprint prefix for realtorsatthebeach.com/plumbing.
  prefix: "rtb-plumb-a9f4-",
  theme: {
    extend: {
      colors: {
        oceanTeal: "#0d9488",
      },
    },
  },
  plugins: [],
};
