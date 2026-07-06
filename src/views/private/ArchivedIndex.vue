<script setup lang="ts">
import { computed, onMounted } from "vue";
import Card from "@/components/Card.vue";
import { useBookmarks } from "@/composables/useBookmark.ts";
import { useBookmarkSort } from "@/composables/useBookmarkSort";
import { useBookmarkSearch } from "@/composables/useBookmarkSearch";
import { useBookmarkTags } from "@/composables/useBookmarkTags";
import CardSkeleton from "@/components/Skeletons/CardSkeleton.vue";

const { bookmarks, loading, fetchBookmarks } = useBookmarks();
const { sortBookmarks } = useBookmarkSort();
const { searchQuery, filterBookmarks } = useBookmarkSearch();
const { selectedTags, filterBookmarksByTags } = useBookmarkTags();

const baseArchivedBookmarks = computed(() =>
  bookmarks.value.filter((bookmark) => bookmark.is_archived),
);

const archivedBookmarks = computed(() =>
  sortBookmarks(
    filterBookmarksByTags(filterBookmarks(baseArchivedBookmarks.value)),
  ),
);

const hasActiveFilters = computed(
  () => Boolean(searchQuery.value.trim()) || selectedTags.value.length > 0,
);

onMounted(() => {
  fetchBookmarks();
});
</script>

<template>
  <div
    v-if="loading && !baseArchivedBookmarks.length"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    <CardSkeleton v-for="n in 6" :key="n" />
  </div>

  <div
    v-else-if="archivedBookmarks.length"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    <Card
      v-for="bookmark in archivedBookmarks"
      :key="bookmark.id"
      :bookmark="bookmark"
      archived
    />
  </div>

  <p
    v-else-if="hasActiveFilters && baseArchivedBookmarks.length"
    class="text-p4 text-neutral-600"
  >
    <template v-if="searchQuery.trim()">
      No archived bookmarks found for "{{ searchQuery.trim() }}".
    </template>
    <template v-else>
      No archived bookmarks tagged: {{ selectedTags.join(", ") }}.
    </template>
  </p>

  <p v-else class="text-p4 text-neutral-600">No archived bookmarks yet.</p>
</template>
