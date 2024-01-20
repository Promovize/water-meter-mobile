import { MD3LightTheme as DefaultTheme } from "react-native-paper";
import { defaultColors } from "./colors";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    ...defaultColors,
    primary: defaultColors.primary,
    secondary: defaultColors.secondary,
  },
};

export { theme };
