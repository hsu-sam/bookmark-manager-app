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
      'flex gap-4 rounded-lg has-disabled:opacity-40 text-small py-3.5 px-4 bg-neutral-0 border border-neutral-400 focus-visible:border-teal-700 items-center',
      $attrs.class,
    ]"
  >
    <Icon icon="lucide:search" size="20" />
    <input
      name="search"
      v-model="model"
      :placeholder
      :disabled
      type="search"
      class="flex-1 w-full focus-visible:outline-none placeholder:text-secondary-gray"
    />
  </label>
</template>
