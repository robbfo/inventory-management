import { ref, watch } from "vue";

const STORAGE_KEY = "dark-mode";
const isDark = ref(localStorage.getItem(STORAGE_KEY) === "true");

// Apply class to <html> on module load so dark mode is instant (no flash)
if (isDark.value) {
  document.documentElement.classList.add("dark");
}

watch(isDark, (val) => {
  localStorage.setItem(STORAGE_KEY, String(val));
  document.documentElement.classList.toggle("dark", val);
});

export function useDarkMode() {
  const toggle = () => {
    isDark.value = !isDark.value;
  };
  return { isDark, toggle };
}
