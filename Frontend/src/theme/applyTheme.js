import { THEMES } from "./themes";

export const applyTheme = (themeName = "pink") => {
  const theme = THEMES[themeName] || THEMES.pink;

  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(
      `--theme-${key}`,
      value
    );
  });
};