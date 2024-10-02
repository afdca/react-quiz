/** @type {import('tailwindcss').Config} */

import tailwindTypography from "@tailwindcss/typography"
import daisyui from "daisyui"
import {
  autumn,
  business,
  corporate,
  cupcake,
  dark,
  dim,
  emerald,
  fantasy,
  forest,
  lemonade,
  light,
  night,
  nord,
  synthwave,
  winter,
} from "daisyui/src/theming/themes"

const themes = {
  dim,
  synthwave,
  fantasy,
  autumn,
  business,
  emerald,
  cupcake,
  nord,
  corporate,
  lemonade,
  forest,
  night,
  winter,
  // Slight dimming of the default light/dark themes
  // see default values in: file:///./node_modules/.pnpm/daisyui@4.12.10_postcss@8.4.41/node_modules/daisyui/src/theming/themes.js
  light: {
    ...light,
    primary: "oklch(49.12% 0.170 275.75)",
    secondary: "oklch(69.71% 0.130 342.55)",
    accent: "oklch(76.76% 0.100 183.61)",
    neutral: "oklch(32.18% 0.015 255.7)",
    error: "oklch(65.72% 0.160 27.33)",
  },
  dark: {
    ...dark,
    primary: "oklch(65.69% 0.160 275.75)",
    secondary: "oklch(74.8% 0.180 342.55)",
    accent: "oklch(74.51% 0.120 183.61)",
  },
}

/** Make the cupcake theme's checkboxes less rounded */
function overrideCupcakeThemeCheckboxRadius({ addComponents }) {
  addComponents({
    ":root:has(input.theme-controller[value=cupcake]:checked) .checkbox": {
      "--rounded-btn": "0.5rem",
    },
  })
}

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [daisyui, tailwindTypography, overrideCupcakeThemeCheckboxRadius],
  theme: { extend: {} },
  daisyui: {
    themes: [themes], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    // darkTheme: "dark", // name of one of the included themes for dark mode
    // base: true, // applies background color and foreground color for root element by default
    // styled: true, // include daisyUI colors and design decisions for all components
    // utils: true, // adds responsive and modifier utility classes
    // prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    // logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    // themeRoot: ":root", // The element that receives theme color CSS variables
  },
}
