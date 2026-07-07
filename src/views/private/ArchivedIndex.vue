<script setup lang="ts">
import { computed, onMounted } from "vue";
import Card from "@/components/Card.vue";
import { useBookmarks } from "@/services/useBookmark";
import { useFolders } from "@/services/useFolder";
import { useBookmarkSort } from "@/composables/useBookmarkSort";
import { useBookmarkSearch } from "@/composables/useBookmarkSearch";
import { useBookmarkTags } from "@/composables/useBookmarkTags";
import { useBookmarkFolders } from "@/composables/useBookmarkFolders";
import EmptyBookmark from "@/components/illustrations/EmptyBookmark.vue";
import CardSkeleton from "@/components/Skeletons/CardSkeleton.vue";
import Pagination from "@/components/ui/Pagination.vue";
import { usePagination } from "@/composables/usePagination";

const { bookmarks, loading, fetchBookmarks } = useBookmarks();
const { fetchFolders } = useFolders();
const { sortBookmarks } = useBookmarkSort();
const { searchQuery, filterBookmarks } = useBookmarkSearch();
const { selectedTags, filterBookmarksByTags } = useBookmarkTags();
const { filterBookmarksByFolder, selectedFolderName } = useBookmarkFolders();

const baseArchivedBookmarks = computed(() =>
  bookmarks.value.filter((bookmark) => bookmark.is_archived),
);

const archivedBookmarks = computed(() =>
  sortBookmarks(
    filterBookmarksByTags(
      filterBookmarksByFolder(filterBookmarks(baseArchivedBookmarks.value)),
    ),
  ),
);

const hasActiveFilters = computed(
  () =>
    Boolean(searchQuery.value.trim()) ||
    selectedTags.value.length > 0 ||
    Boolean(selectedFolderName.value),
);

const { currentPage, totalPages, paginatedItems, pageSize } =
  usePagination(archivedBookmarks);

onMounted(() => {
  fetchBookmarks();
  fetchFolders();
});
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col">
    <div
      v-if="loading && !baseArchivedBookmarks.length"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <CardSkeleton v-for="n in 6" :key="n" />
    </div>

    <div v-else-if="archivedBookmarks.length" class="flex flex-1 flex-col gap-400">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card
          v-for="bookmark in paginatedItems"
          :key="bookmark.id"
          :bookmark="bookmark"
          archived
        />
      </div>

      <Pagination
        v-if="totalPages > 1"
        v-model="currentPage"
        class="mt-auto shrink-0"
        :total-pages="totalPages"
        :total-items="archivedBookmarks.length"
        :page-size="pageSize"
      />
    </div>

    <p
      v-else-if="hasActiveFilters && baseArchivedBookmarks.length"
      class="text-p4 text-neutral-600"
    >
      <template v-if="searchQuery.trim()">
        No archived bookmarks found for "{{ searchQuery.trim() }}".
      </template>
      <template v-else-if="selectedTags.length">
        No archived bookmarks tagged: {{ selectedTags.join(", ") }}.
      </template>
      <template v-else-if="selectedFolderName">
        No archived bookmarks in folder "{{ selectedFolderName }}".
      </template>
    </p>

    <div
      v-else
      class="flex flex-1 flex-col items-center justify-center w-full px-200 py-300 sm:px-400 sm:py-400"
    >
      <EmptyBookmark
        class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
      />
    </div>
  </div>
</template>
