import { ref } from "vue";

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

  return {
    selectedTags,
    toggleTag,
    clearTags,
  };
}
