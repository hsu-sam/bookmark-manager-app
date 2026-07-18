export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export const motionTransition = {
  press: { duration: 0.16, ease: EASE_OUT },
  toast: { duration: 0.2, ease: EASE_OUT },
  toastExit: { duration: 0.15, ease: EASE_OUT },
  stagger: { duration: 0.25, ease: EASE_OUT },
  staggerDelay: 0.05,
} as const;
