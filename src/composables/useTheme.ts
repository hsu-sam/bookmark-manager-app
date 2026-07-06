import { ref } from "vue";

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const theme = ref<Theme>("light");

function applyTheme(value: Theme) {
  document.documentElement.classList.toggle("dark", value === "dark");
}

export function initTheme() {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === "light" || stored === "dark") {
    theme.value = stored;
  } else {
    theme.value = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  applyTheme(theme.value);
}

export function useTheme() {
  function setTheme(value: Theme) {
    theme.value = value;
    localStorage.setItem(STORAGE_KEY, value);
    applyTheme(value);
  }

  return { theme, setTheme };
}
