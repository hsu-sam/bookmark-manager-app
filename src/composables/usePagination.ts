import { computed, ref, watch, type ComputedRef, type Ref } from "vue";

export const PAGE_SIZE = 10;

type ItemsSource<T> = Ref<T[]> | ComputedRef<T[]>;

export function usePagination<T extends { id: string }>(items: ItemsSource<T>) {
  const currentPage = ref(1);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(items.value.length / PAGE_SIZE)),
  );

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE;
    return items.value.slice(start, start + PAGE_SIZE);
  });

  watch(
    () => items.value.map((item) => item.id).join(","),
    (next, prev) => {
      if (next !== prev) {
        currentPage.value = 1;
      }
    },
  );

  watch(
    () => items.value.length,
    () => {
      if (currentPage.value > totalPages.value) {
        currentPage.value = totalPages.value;
      }
    },
  );

  let skipScroll = true;
  watch(currentPage, () => {
    if (skipScroll) {
      skipScroll = false;
      return;
    }
    document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
  });

  function goToPage(page: number) {
    currentPage.value = Math.min(Math.max(1, page), totalPages.value);
  }

  return {
    currentPage,
    totalPages,
    paginatedItems,
    pageSize: PAGE_SIZE,
    goToPage,
  };
}
