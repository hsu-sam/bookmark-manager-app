import { ref } from "vue";

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

export function useBookmarkSort() {
  const setSortBy = (value: BookmarkSortOption) => {
    sortBy.value = value;
  };

  return {
    sortBy,
    setSortBy,
  };
}
