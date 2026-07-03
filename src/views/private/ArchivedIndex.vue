<script setup lang="ts">
import { computed, onMounted } from "vue";
import Card from "@/components/Card.vue";
import { useBookmarks } from "@/composables/useBookmark.ts";
import { useBookmarkSort } from "@/composables/useBookmarkSort";

const { bookmarks, fetchBookmarks } = useBookmarks();
const { sortBookmarks } = useBookmarkSort();

const archivedBookmarks = computed(() =>
  sortBookmarks(bookmarks.value.filter((bookmark) => bookmark.is_archived)),
);

onMounted(() => {
  fetchBookmarks();
});
</script>

<template>
  <div
    v-if="archivedBookmarks.length"
    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  >
    <Card
      v-for="bookmark in archivedBookmarks"
      :key="bookmark.id"
      :bookmark="bookmark"
      archived
    />
  </div>

  <p v-else class="text-p4 text-neutral-600">No archived bookmarks yet.</p>
</template>
