<script setup lang="ts">
import { computed } from "vue";
import { AnimatePresence, motion } from "motion-v";
import Toast from "@/components/ui/Toast.vue";
import { useToast } from "@/composables/useToast";
import { usePrefersReducedMotion } from "@/composables/usePrefersReducedMotion";
import { motionTransition } from "@/constants/motion";

const { toasts, dismiss } = useToast();
const { prefersReducedMotion } = usePrefersReducedMotion();

const toastVariants = computed(() => ({
  initial: {
    opacity: 0,
    transform: prefersReducedMotion.value ? "none" : "translateX(16px)",
  },
  animate: {
    opacity: 1,
    transform: "translateX(0)",
    transition: motionTransition.toast,
  },
  exit: {
    opacity: 0,
    transform: prefersReducedMotion.value ? "none" : "translateX(16px)",
    transition: motionTransition.toastExit,
  },
}));
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-200 right-200 z-50 flex flex-col gap-100 items-end">
      <AnimatePresence>
        <motion.div
          v-for="item in toasts"
          :key="item.id"
          :initial="toastVariants.initial"
          :animate="toastVariants.animate"
          :exit="toastVariants.exit"
        >
          <Toast
            :type="item.type"
            :message="item.message"
            @close="dismiss(item.id)"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  </Teleport>
</template>
