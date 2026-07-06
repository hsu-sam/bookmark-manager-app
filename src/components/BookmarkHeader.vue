<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import SortDropdown from "./Dropdowns/SortDropdown.vue";
import { useBookmarkSort } from "@/composables/useBookmarkSort";
import { useBookmarkSearch } from "@/composables/useBookmarkSearch";
import { useBookmarkTags } from "@/composables/useBookmarkTags";

const route = useRoute();
const { sortBy } = useBookmarkSort();
const { searchQuery } = useBookmarkSearch();
const { selectedTags } = useBookmarkTags();

const title = computed(() => {
  const query = searchQuery.value.trim();
  const tags = selectedTags.value;
  const isArchived = route.name === "user.archived";
  const defaultTitle = isArchived ? "Archived Bookmarks" : "All Bookmarks";

  if (query) {
    return `Results for: "${query}"`;
  }

  if (tags.length) {
    const prefix = isArchived ? "Archived bookmarks tagged" : "Bookmarks tagged";
    return `${prefix}: ${tags.join(", ")}`;
  }

  return defaultTitle;
});
</script>

<template>
  <div class="flex items-center justify-between">
    <h1>{{ title }}</h1>

    <SortDropdown v-model="sortBy" />
  </div>
</template>
