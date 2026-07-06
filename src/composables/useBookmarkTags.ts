import { ref } from "vue";
import type { Bookmark } from "@/types/bookmark";

const selectedTags = ref<string[]>([]);

export function useBookmarkTags() {
  const toggleTag = (tag: string) => {
    if (selectedTags.value.includes(tag)) {
      selectedTags.value = selectedTags.value.filter((t) => t !== tag);
      return;
    }

    selectedTags.value = [...selectedTags.value, tag];
  };

  const clearTags = () => {
    selectedTags.value = [];
  };

  const filterBookmarksByTags = (bookmarks: Bookmark[]) => {
    if (!selectedTags.value.length) return bookmarks;

    return bookmarks.filter((bookmark) =>
      selectedTags.value.every((tag) => bookmark.tags?.includes(tag)),
    );
  };

  return {
    selectedTags,
    toggleTag,
    clearTags,
    filterBookmarksByTags,
  };
}
