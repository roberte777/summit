import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        noto: ["var(--font-noto-sans)", ...fontFamily.sans],
      },
      colors: {
        summit: {
          "100": "#CAD2C5",
          "300": "#84A98C",
          "500": "#52796F",
          "700": "#354F52",
          "900": "#2F3E46",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
} satisfies Config;
