<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";

export interface InputProps {
  disabled?: boolean;
  placeholder?: string;
}
defineProps<InputProps>();

const model = defineModel();
const inputRef = ref<HTMLInputElement | null>(null);

defineExpose({
  focus: () => inputRef.value?.focus(),
});
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
      ref="inputRef"
      name="search"
      v-model="model"
      :placeholder
      :disabled
      type="search"
      aria-keyshortcuts="/"
      class="flex-1 w-full border-0 bg-transparent focus-visible:outline-none placeholder:text-neutral-500 dark:text-neutral-dark-0 dark:placeholder:text-neutral-dark-100/60"
    />
  </label>
</template>
