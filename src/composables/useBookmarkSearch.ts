import { ref } from "vue";

const searchQuery = ref("");

export function useBookmarkSearch() {
  return {
    searchQuery,
  };
}
