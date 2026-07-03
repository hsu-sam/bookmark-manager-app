<script setup lang="ts">
import { computed, onMounted } from "vue";
import Card from "@/components/Card.vue";
import { useBookmarks } from "@/composables/useBookmark.ts";
import { useBookmarkSort } from "@/composables/useBookmarkSort";
import EmptyBookmark from "@/components/illustrations/EmptyBookmark.vue";

const { bookmarks, fetchBookmarks } = useBookmarks();
const { sortBookmarks } = useBookmarkSort();

const activeBookmarks = computed(() =>
  sortBookmarks(bookmarks.value.filter((bookmark) => !bookmark.is_archived)),
);

onMounted(() => {
  fetchBookmarks();
});
</script>

<template>
  <div
    v-if="activeBookmarks.length"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    <Card
      v-for="bookmark in activeBookmarks"
      :key="bookmark.id"
      :bookmark="bookmark"
    />
  </div>

  <div v-else class="flex flex-col items-center justify-center h-full">
    <EmptyBookmark />
  </div>
</template>
