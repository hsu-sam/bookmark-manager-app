import { ref } from "vue";
import type { Bookmark } from "@/types/bookmark";

const searchQuery = ref("");

function matchesSearch(bookmark: Bookmark, query: string) {
  const haystack = [
    bookmark.title,
    bookmark.url,
    bookmark.description ?? "",
    ...(bookmark.tags ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function useBookmarkSearch() {
  const filterBookmarks = (bookmarks: Bookmark[]) => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return bookmarks;

    return bookmarks.filter((bookmark) => matchesSearch(bookmark, query));
  };

  return {
    searchQuery,
    filterBookmarks,
  };
}
