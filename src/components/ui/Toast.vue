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
    class="flex items-start gap-100 w-full sm:w-sm px-200 py-150 rounded-12 shadow-lg bg-neutral-0 border-l-4"
    :class="type === 'success' ? 'border-teal-700' : 'border-red-600'"
    role="alert"
  >
    <Icon
      :icon="type === 'success' ? 'lucide:check-circle-2' : 'lucide:alert-circle'"
      :class="type === 'success' ? 'text-teal-700' : 'text-red-600'"
      class="shrink-0 mt-025"
      width="20"
      height="20"
    />
    <p class="flex-1 text-small font-medium text-neutral-900">{{ message }}</p>
    <button
      type="button"
      class="shrink-0 cursor-pointer text-secondary-gray"
      aria-label="Dismiss"
      @click="$emit('close')"
    >
      <Icon icon="lucide:x" width="16" height="16" />
    </button>
  </div>
</template>
