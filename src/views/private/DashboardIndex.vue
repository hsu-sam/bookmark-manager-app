<script setup lang="ts">
import { computed, onMounted } from "vue";
import Card from "@/components/Card.vue";
import CardSkeleton from "@/components/CardSkeleton.vue";
import { useBookmarks } from "@/composables/useBookmark.ts";
import { useBookmarkSort } from "@/composables/useBookmarkSort";
import { useBookmarkSearch } from "@/composables/useBookmarkSearch";
import EmptyBookmark from "@/components/illustrations/EmptyBookmark.vue";

const { bookmarks, loading, fetchBookmarks } = useBookmarks();
const { sortBookmarks } = useBookmarkSort();
const { searchQuery, filterBookmarks } = useBookmarkSearch();

const baseActiveBookmarks = computed(() =>
  bookmarks.value.filter((bookmark) => !bookmark.is_archived),
);

const activeBookmarks = computed(() =>
  sortBookmarks(filterBookmarks(baseActiveBookmarks.value)),
);

onMounted(() => {
  fetchBookmarks();
});
</script>

<template>
  <div
    v-if="loading && !baseActiveBookmarks.length"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    <CardSkeleton v-for="n in 6" :key="n" />
  </div>

  <div
    v-else-if="activeBookmarks.length"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    <Card
      v-for="bookmark in activeBookmarks"
      :key="bookmark.id"
      :bookmark="bookmark"
    />
  </div>

  <p
    v-else-if="searchQuery.trim() && baseActiveBookmarks.length"
    class="text-p4 text-neutral-600"
  >
    No bookmarks found for "{{ searchQuery.trim() }}".
  </p>

  <div v-else class="flex flex-col items-center justify-center h-full">
    <EmptyBookmark />
  </div>
</template>
