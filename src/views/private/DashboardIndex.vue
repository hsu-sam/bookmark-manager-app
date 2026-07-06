<script setup lang="ts">
import { computed, onMounted } from "vue";
import Card from "@/components/Card.vue";
import { useBookmarks } from "@/composables/useBookmark.ts";
import { useBookmarkSort } from "@/composables/useBookmarkSort";
import { useBookmarkSearch } from "@/composables/useBookmarkSearch";
import EmptyBookmark from "@/components/illustrations/EmptyBookmark.vue";
import CardSkeleton from "@/components/Skeletons/CardSkeleton.vue";

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

  <div
    v-else
    class="flex flex-1 flex-col items-center justify-center w-full px-200 py-300 sm:px-400 sm:py-400"
  >
    <EmptyBookmark
      class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
    />
  </div>
</template>
