import { createTheme } from "@mui/material/styles";
import { palette_secondary, palette_primary, palette_grey } from "./palettes";
import React from "react";
import sx from "@mui/system/sx";
import { OutlinedInputClassKey } from "@mui/material/OutlinedInput";

declare module "@mui/material/styles" {
  interface TypographyVariants {
    body3: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
  }
}
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
  }
}

// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      ...palette_primary,
    },
    secondary: {
      ...palette_secondary,
    },
    grey: {
      ...palette_grey,
    },
    error: {
      "50": "#FFF0F1",
      "100": "#FFDBDE",
      "200": "#FFBDC2",
      "300": "#FF99A2",
      "400": "#FF7A86",
      "500": "#FF505F",
      "600": "#EB0014",
      "700": "#C70011",
      "800": "#94000D",
      "900": "#570007",
      main: "#EB0014",
      light: "#FF99A2",
      dark: "#C70011",
      contrastText: "#fff",
    },
    background: {
      default: "#1C0D28",
      paper: "#280D3E",
    },
    text: {
      primary: "#fff",
    },
  },
  typography: {
    fontFamily: ["Rubik", "Roboto", "sans-serif"].join(","),
    body3: {
      fontSize: "0.7rem",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
      styleOverrides: {
        root: {
          color: palette_primary.light,
          fontWeight: 700,
          display: "inline-flex",
          alignItems: "center",
          "&:hover": {
            color: palette_primary["200"],
          },
          "&.MuiTypography-body1 > svg": {
            marginTop: 2,
          },
          "& svg:last-child": {
            marginLeft: 2,
          },
        },
      },
    },

    MuiButtonBase: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        sizeLarge: {
          padding: "0.875rem 1rem",
          fontSize: "1rem",
          lineHeight: 1.3125,
          letterSpacing: 0,
        },
        sizeSmall: {
          padding: "4px 8px",
          marginLeft: "-8px",
        },
        containedPrimary: {
          backgroundColor: palette_primary.main,
          color: "#fff",
        },
      },
      variants: [
        {
          props: {
            // "variant": "code" --> Not allowed in interface
            variant: "contained",
          },
          style: {
            color: palette_primary.contrastText,
            border: "1px solid",
            borderColor: palette_primary["400"],
            backgroundColor: palette_primary.main,
            fontSize: "0.8125rem",
            lineHeight: 1.5,
            letterSpacing: 0,
            WebkitFontSmoothing: "subpixel-antialiased",
            "&:hover, &.Mui-focusVisible": {
              borderColor: palette_primary["300"],
              backgroundColor: palette_primary["500"],
            },
          },
        },
        {
          props: {
            variant: "text",
          },
          style: {
            fontSize: "0.875rem",
            fontWeight: 700,
            color: palette_primary.light,
            mb: 1,
            "& svg": {
              ml: -0.5,
            },
          },
        },
      ],
    },
  },
});

export default theme;
