<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    title: string;
    defaultOpen?: boolean;
  }>(),
  {
    defaultOpen: true,
  },
);

const isOpen = ref(props.defaultOpen);

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div class="flex flex-col gap-100">
    <div class="flex items-center justify-between gap-050">
      <button
        type="button"
        class="flex min-w-0 flex-1 items-center gap-100 rounded-8 px-150 py-100 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-dark-600"
        :aria-expanded="isOpen"
        @click="toggle"
      >
        <Icon
          icon="lucide:chevron-down"
          class="size-4 shrink-0 text-neutral-800 transition-transform dark:text-neutral-dark-100"
          :class="isOpen ? '' : '-rotate-90'"
        />
        <span
          class="truncate text-preset-5 font-bold uppercase text-neutral-800 dark:text-neutral-dark-100"
        >
          {{ title }}
        </span>
      </button>

      <div
        v-if="$slots.actions"
        class="flex shrink-0 items-center gap-050 pr-050"
      >
        <slot name="actions" />
      </div>
    </div>

    <div v-show="isOpen" class="flex flex-col gap-050">
      <slot />
    </div>
  </div>
</template>
