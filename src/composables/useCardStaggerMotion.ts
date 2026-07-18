import { computed } from "vue";
import { usePrefersReducedMotion } from "@/composables/usePrefersReducedMotion";
import { motionTransition } from "@/constants/motion";

export function useCardStaggerMotion() {
  const { prefersReducedMotion } = usePrefersReducedMotion();

  const cardInitial = computed(() => ({
    opacity: 0,
    transform: prefersReducedMotion.value ? "none" : "translateY(8px)",
  }));

  const cardAnimate = {
    opacity: 1,
    transform: "translateY(0)",
  };

  function cardTransition(index: number) {
    return {
      ...motionTransition.stagger,
      delay: prefersReducedMotion.value
        ? 0
        : index * motionTransition.staggerDelay,
    };
  }

  return { cardInitial, cardAnimate, cardTransition };
}
