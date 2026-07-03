import { ref } from "vue";
import type { Bookmark } from "@/types/home";

export type BookmarkSortOption =
  | "recently-added"
  | "most-visited"
  | "recently-visited";

export const bookmarkSortOptions: {
  value: BookmarkSortOption;
  label: string;
}[] = [
  {
    value: "recently-added",
    label: "Recently added",
  },
  {
    value: "most-visited",
    label: "Most visited",
  },
  {
    value: "recently-visited",
    label: "Recently visited",
  },
];

const sortBy = ref<BookmarkSortOption>("recently-added");

function getLastVisitedTime(bookmark: Bookmark) {
  if (!bookmark.last_visited) return 0;
  return new Date(bookmark.last_visited).getTime();
}

function comparePinned(a: Bookmark, b: Bookmark) {
  if (a.is_pinned === b.is_pinned) return 0;
  return a.is_pinned ? -1 : 1;
}

export function useBookmarkSort() {
  const setSortBy = (value: BookmarkSortOption) => {
    sortBy.value = value;
  };

  const sortBookmarks = (bookmarks: Bookmark[]) => {
    return [...bookmarks].sort((a, b) => {
      const pinnedOrder = comparePinned(a, b);
      if (pinnedOrder !== 0) return pinnedOrder;

      switch (sortBy.value) {
        case "most-visited":
          return b.visit_count - a.visit_count;
        case "recently-visited":
          return getLastVisitedTime(b) - getLastVisitedTime(a);
        case "recently-added":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });
  };

  return {
    sortBy,
    setSortBy,
    sortBookmarks,
  };
}
