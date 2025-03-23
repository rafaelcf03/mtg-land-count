import { alpha, createTheme, getContrastRatio } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    violet: Palette["primary"];
  }

  interface PaletteOptions {
    violet?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Switch" {
  interface SwitchPropsColorOverrides {
    violet: true;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    violet: true;
  }
}

const violetBase = "#7F00FF";
const violetMain = alpha(violetBase, 0.7);

export const theme = createTheme({
  palette: {
    violet: {
      main: violetMain,
      light: alpha(violetBase, 0.5),
      dark: alpha(violetBase, 0.9),
      contrastText:
        getContrastRatio(violetMain, "#fff") > 4.5 ? "#fff" : "#111",
    },
  },
});
