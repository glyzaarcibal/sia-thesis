import * as React from "react";
import {
  MD3LightTheme as DefaultTheme,
  configureFonts,
} from "react-native-paper";

// Start with the default font configuration
const fontConfig = {
  fontFamily: "Primary",
};

// Create the customized theme
const theme = {
  ...DefaultTheme,
  myOwnProperty: true,
  colors: {
    primary: "#0cdfc6",
    onPrimary: "white",
    primaryContainer: "#0cdfc6",
    onPrimaryContainer: "rgb(240, 219, 255)",
    secondary: "rgb(208, 193, 218)",
    onSecondary: "rgb(54, 44, 63)",
    secondaryContainer: "rgb(77, 67, 87)",
    onSecondaryContainer: "rgb(237, 221, 246)",
    tertiary: "rgb(243, 183, 190)",
    onTertiary: "rgb(75, 37, 43)",
    tertiaryContainer: "rgb(255, 255,255)",
    onTertiaryContainer: "#0cdfc6",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "white",
    onBackground: "rgb(231, 225, 229)",
    surface: "white",
    onSurface: "black",
    text: "black",
    surfaceVariant: "rgb(74, 69, 78)",
    onSurfaceVariant: "rgb(204, 196, 206)",
    outline: "rgb(150, 142, 152)",
    outlineVariant: "rgb(74, 69, 78)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(231, 225, 229)",
    inverseOnSurface: "rgb(50, 47, 51)",
    inversePrimary: "rgb(120, 69, 172)",
    elevation: {
      level0: "transparent",
      level1: "rgb(39, 35, 41)",
      level2: "rgb(44, 40, 48)",
      level3: "rgb(50, 44, 55)",
      level4: "rgb(52, 46, 57)",
      level5: "rgb(56, 49, 62)",
    },
    surfaceDisabled: "rgba(231, 225, 229, 0.12)",
    onSurfaceDisabled: "rgba(231, 225, 229, 0.38)",
    backdrop: "rgba(51, 47, 55, 0.4)",
  },
  // Use the configureFonts function to properly set up all the font variants
  // This will automatically apply your fontFamily to all the default font configurations
  fonts: configureFonts({ config: fontConfig }),
};

export default theme;
