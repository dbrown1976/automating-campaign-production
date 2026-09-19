import { colorsTuple, createTheme } from "@mantine/core";

export const amplienceTheme = createTheme({
  fontFamily: '"IBM Plex Sans", Arial, sans-serif',
  fontFamilyMonospace: '"IBM Plex Mono", monospace',
  headings: {
    fontFamily: '"IBM Plex Sans", Arial, sans-serif',
    fontWeight: "400",
    sizes: {
      h1: { fontSize: "28px", lineHeight: "40px", fontWeight: "400" },
      h2: { fontSize: "22px", lineHeight: "38px", fontWeight: "500" },
      h3: { fontSize: "16px", lineHeight: "28px", fontWeight: "400" },
    },
  },
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "14px",
    lg: "16px",
    xl: "22px",
  },
  lineHeights: {
    xs: "14px",
    sm: "24px",
    md: "24px",
    lg: "28px",
    xl: "38px",
  },
  spacing: {
    xs: "8px",
    sm: "12px",
    md: "20px",
    lg: "24px",
    xl: "40px",
  },
  radius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "100px",
  },
  defaultRadius: "xs",
  cursorType: "pointer",
  focusRing: "auto",
  primaryColor: "amplience-primary",
  colors: {
    "amplience-primary": colorsTuple("#0374DD"),
    "amplience-danger": colorsTuple("#E22840"),
    "amplience-warning": colorsTuple("#EC7520"),
    "amplience-success": colorsTuple("#5AB513"),
    "amplience-info": colorsTuple("#216083"),
    "amplience-ocean": colorsTuple("#002C42"),
  },
  shadows: {
    xs: "0 2px 4px 1px rgb(0 44 66 / 8%)",
    sm: "0 3.5px 8px 2px rgb(0 44 66 / 10%)",
    md: "0 5px 12px 3px rgb(0 44 66 / 20%)",
    lg: "0 6.5px 16px 4px rgb(0 44 66 / 15%)",
    xl: "0 8px 20px 5px rgb(0 44 66 / 20%)",
  },
});
