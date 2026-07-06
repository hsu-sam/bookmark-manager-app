<script setup lang="ts">
import { computed } from "vue";
import Button from "./Button.vue";

const currentPage = defineModel<number>({ required: true });

const props = defineProps<{
  totalPages: number;
  totalItems: number;
  pageSize: number;
}>();

const startItem = computed(() => (currentPage.value - 1) * props.pageSize + 1);
const endItem = computed(() =>
  Math.min(currentPage.value * props.pageSize, props.totalItems),
);

const visiblePages = computed(() => {
  const { totalPages } = props;
  const current = currentPage.value;

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, current]);

  for (let page = current - 1; page <= current + 1; page += 1) {
    if (page > 1 && page < totalPages) {
      pages.add(page);
    }
  }

  return [...pages].sort((a, b) => a - b);
});

function goToPage(page: number) {
  if (page < 1 || page > props.totalPages || page === currentPage.value) return;
  currentPage.value = page;
}
</script>

<template>
  <div
    class="flex flex-col gap-200 border-t border-neutral-400 pt-250 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-dark-500"
  >
    <p class="text-preset-4 text-neutral-800 dark:text-neutral-dark-100">
      Showing {{ startItem }}-{{ endItem }} of {{ totalItems }}
    </p>

    <div class="flex flex-wrap items-center gap-100">
      <Button
        variant="secondary"
        type="button"
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </Button>

      <div class="flex items-center gap-050">
        <template v-for="(page, index) in visiblePages" :key="page">
          <span
            v-if="index > 0 && page - visiblePages[index - 1]! > 1"
            class="px-100 text-preset-4 text-neutral-500 dark:text-neutral-dark-100"
          >
            ...
          </span>

          <button
            type="button"
            class="flex size-8 items-center justify-center rounded-8 text-preset-4 font-semibold transition-colors"
            :class="
              page === currentPage
                ? 'bg-teal-700 text-neutral-0 dark:bg-teal-700'
                : 'text-neutral-800 hover:bg-neutral-100 dark:text-neutral-dark-100 dark:hover:bg-neutral-dark-600'
            "
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </template>
      </div>

      <Button
        variant="secondary"
        type="button"
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </Button>
    </div>
  </div>
</template>
