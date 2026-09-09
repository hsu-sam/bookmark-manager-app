import { computed, ref, watch } from "vue";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { listBookmarks } from "@/services/useBookmark";
import { bookmarkKeys } from "@/services/queryKeys";
import { useBookmarkSearch } from "./useBookmarkSearch";
import { useBookmarkTags } from "./useBookmarkTags";
import { useBookmarkFolders } from "./useBookmarkFolders";
import { useBookmarkSort } from "./useBookmarkSort";

export const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export function useBookmarkList(archived: boolean) {
  const { searchQuery } = useBookmarkSearch();
  const { selectedTags } = useBookmarkTags();
  const { selectedFolderId } = useBookmarkFolders();
  const { sortBy } = useBookmarkSort();

  const currentPage = ref(1);

  // Debounce only the search text; every other filter refetches immediately.
  const debouncedSearch = ref(searchQuery.value);
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  watch(searchQuery, (next) => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      debouncedSearch.value = next;
    }, SEARCH_DEBOUNCE_MS);
  });

  // Any filter/sort change jumps back to page 1. currentPage itself becomes
  // part of the query key below, so this is what triggers the refetch --
  // no separate "reset and refresh" call needed.
  watch([debouncedSearch, selectedTags, selectedFolderId, sortBy], () => {
    currentPage.value = 1;
  });

  const params = computed(() => ({
    archived,
    page: currentPage.value,
    pageSize: PAGE_SIZE,
    search: debouncedSearch.value.trim(),
    folderId: selectedFolderId.value,
    tags: [...selectedTags.value].sort(),
    sort: sortBy.value,
  }));

  const query = useQuery({
    queryKey: computed(() => bookmarkKeys.list(params.value)),
    queryFn: () => listBookmarks(params.value),
    // Without this, the grid would flash empty/skeleton every time you
    // change page or filters, because a new query key starts with no data.
    // keepPreviousData keeps rendering the last page's results (query.data)
    // while the new request is in flight, so isPending only stays true on
    // the very first load -- exactly what the skeleton condition wants.
    placeholderData: keepPreviousData,
  });

  const bookmarks = computed(() => query.data.value?.data ?? []);
  const totalItems = computed(() => query.data.value?.count ?? 0);
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalItems.value / PAGE_SIZE)),
  );

  // If a delete shrinks the result set below the current page, snap back.
  watch(totalPages, (maxPage) => {
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage;
    }
  });

  let isFirstLoad = true;
  watch(bookmarks, () => {
    if (!isFirstLoad) {
      document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
    }
    isFirstLoad = false;
  });

  return {
    bookmarks,
    loading: query.isPending,
    error: computed(() => query.error.value?.message ?? null),
    currentPage,
    totalPages,
    totalItems,
    pageSize: PAGE_SIZE,
    refresh: query.refetch,
  };
}
