import { onMounted, onUnmounted, ref } from "vue";

export function usePrefersReducedMotion() {
  const prefersReducedMotion = ref(false);
  let mediaQuery: MediaQueryList | undefined;

  const onChange = (event: MediaQueryListEvent) => {
    prefersReducedMotion.value = event.matches;
  };

  onMounted(() => {
    mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.value = mediaQuery.matches;
    mediaQuery.addEventListener("change", onChange);
  });

  onUnmounted(() => {
    mediaQuery?.removeEventListener("change", onChange);
  });

  return { prefersReducedMotion };
}
