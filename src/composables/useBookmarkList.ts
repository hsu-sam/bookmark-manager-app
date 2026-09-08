import { computed, ref, watch } from "vue";
import { bookmarksVersion, useBookmarks } from "@/services/useBookmark";
import { useBookmarkSearch } from "./useBookmarkSearch";
import { useBookmarkTags } from "./useBookmarkTags";
import { useBookmarkFolders } from "./useBookmarkFolders";
import { useBookmarkSort } from "./useBookmarkSort";
import type { Bookmark } from "@/types/bookmark";

export const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export function useBookmarkList(archived: boolean) {
  const { listBookmarks } = useBookmarks();
  const { searchQuery } = useBookmarkSearch();
  const { selectedTags } = useBookmarkTags();
  const { selectedFolderId } = useBookmarkFolders();
  const { sortBy } = useBookmarkSort();

  const bookmarks = ref<Bookmark[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const totalItems = ref(0);

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalItems.value / PAGE_SIZE)),
  );

  async function refresh() {
    loading.value = true;
    error.value = null;

    const result = await listBookmarks({
      archived,
      page: currentPage.value,
      pageSize: PAGE_SIZE,
      search: searchQuery.value,
      folderId: selectedFolderId.value,
      tags: selectedTags.value,
      sort: sortBy.value,
    });

    loading.value = false;

    if (result.error) {
      error.value = result.error;
      bookmarks.value = [];
      totalItems.value = 0;
      return;
    }

    bookmarks.value = result.data;
    totalItems.value = result.count;

    const maxPage = Math.max(1, Math.ceil(totalItems.value / PAGE_SIZE));
    if (currentPage.value > maxPage) {
      currentPage.value = maxPage;
    }
  }

  // Debounce only the search text; every other input refetches immediately.
  const debouncedSearch = ref(searchQuery.value);
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  watch(searchQuery, (next) => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      debouncedSearch.value = next;
    }, SEARCH_DEBOUNCE_MS);
  });

  // Any filter/sort change jumps back to page 1.
  watch([debouncedSearch, selectedTags, selectedFolderId, sortBy], () => {
    currentPage.value = 1;
  });

  const queryKey = computed(() =>
    JSON.stringify({
      page: currentPage.value,
      search: debouncedSearch.value.trim(),
      tags: [...selectedTags.value].sort(),
      folderId: selectedFolderId.value,
      sort: sortBy.value,
      version: bookmarksVersion.value,
    }),
  );

  let isFirstFetch = true;
  watch(
    queryKey,
    () => {
      refresh();
      if (!isFirstFetch) {
        document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
      }
      isFirstFetch = false;
    },
    { immediate: true },
  );

  return {
    bookmarks,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    pageSize: PAGE_SIZE,
    refresh,
  };
}
