<script setup lang="ts">
import { Icon } from "@iconify/vue";

export interface InputProps {
  disabled?: boolean;
  placeholder?: string;
}
const props = defineProps<InputProps>();

const model = defineModel();
</script>
<template>
  <label
    :class="[
      'flex gap-4 rounded-lg has-disabled:opacity-40 text-preset-4 py-100 px-125 md:py-150 md:px-150 bg-neutral-0 border border-neutral-400 focus-within:border-teal-700 items-center text-neutral-800 transition-colors dark:bg-neutral-dark-800 dark:border-neutral-dark-500 dark:focus-within:border-neutral-dark-300 dark:text-neutral-dark-100',
      $attrs.class,
    ]"
  >
    <Icon icon="local:icon-search" size="20" />
    <input
      name="search"
      v-model="model"
      :placeholder
      :disabled
      type="search"
      class="flex-1 w-full border-0 bg-transparent focus-visible:outline-none placeholder:text-neutral-500 dark:text-neutral-dark-0 dark:placeholder:text-neutral-dark-100/60"
    />
  </label>
</template>
