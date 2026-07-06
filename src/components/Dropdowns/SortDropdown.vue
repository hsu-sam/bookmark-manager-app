<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { DropdownMenuItem } from "radix-vue";
import Button from "../ui/Button.vue";
import Dropdown from "../ui/Dropdown.vue";
import {
  bookmarkSortOptions,
  type BookmarkSortOption,
} from "@/composables/useBookmarkSort";

const sortBy = defineModel<BookmarkSortOption>({
  default: "recently-added",
});
</script>

<template>
  <Dropdown align="end" content-class="min-w-[200px]">
    <template #trigger>
      <Button variant="secondary" type="button" class="shrink-0 w-fit">
        <Icon icon="local:icon-sort" />
        Sort by
      </Button>
    </template>

    <template #content>
      <DropdownMenuItem
        v-for="option in bookmarkSortOptions"
        :key="option.value"
        class="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 cursor-pointer outline-none select-none transition-colors focus:bg-neutral-100 dark:text-neutral-dark-100 dark:focus:bg-neutral-dark-600"
        @click="sortBy = option.value"
      >
        <span>{{ option.label }}</span>
        <Icon
          v-if="sortBy === option.value"
          icon="local:icon-check"
          class="w-4 h-4 shrink-0 text-teal-700 dark:text-neutral-dark-300"
        />
      </DropdownMenuItem>
    </template>
  </Dropdown>
</template>
