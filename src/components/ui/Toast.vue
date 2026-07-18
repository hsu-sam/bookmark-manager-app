<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { ToastType } from "@/composables/useToast";

defineProps<{
  type: ToastType;
  message: string;
}>();

defineEmits<{
  close: [];
}>();
</script>

<template>
  <div
    class="flex items-start gap-100 w-full sm:w-sm px-200 py-150 rounded-12 shadow-lg bg-neutral-0 border-l-4 dark:bg-neutral-dark-800 dark:border-neutral-dark-500 dark:border dark:border-l-4"
    :class="type === 'success' ? 'border-teal-700 dark:border-l-teal-700' : 'border-red-600 dark:border-l-red-600'"
    role="alert"
  >
    <Icon
      :icon="type === 'success' ? 'local:icon-check' : 'lucide:alert-circle'"
      :class="type === 'success' ? 'text-teal-700 dark:text-neutral-dark-300' : 'text-red-600'"
      class="shrink-0 mt-025"
      width="20"
      height="20"
    />
    <p class="flex-1 text-small font-medium text-neutral-900 dark:text-neutral-dark-0">
      {{ message }}
    </p>
    <button
      type="button"
      class="shrink-0 cursor-pointer transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] text-secondary-gray dark:text-neutral-dark-100 dark:hover:text-neutral-dark-0"
      aria-label="Dismiss"
      @click="$emit('close')"
    >
      <Icon icon="local:icon-close" width="16" height="16" />
    </button>
  </div>
</template>
