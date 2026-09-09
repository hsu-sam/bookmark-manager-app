<script setup lang="ts">
import { computed } from "vue";
import Card from "@/components/Card.vue";
import { useBookmarkSearch } from "@/composables/useBookmarkSearch";
import { useBookmarkTags } from "@/composables/useBookmarkTags";
import { useBookmarkFolders } from "@/composables/useBookmarkFolders";
import EmptyBookmark from "@/components/illustrations/EmptyBookmark.vue";
import CardSkeleton from "@/components/Skeletons/CardSkeleton.vue";
import Pagination from "@/components/ui/Pagination.vue";
import { useBookmarkList } from "@/composables/useBookmarkList";

const { searchQuery } = useBookmarkSearch();
const { selectedTags } = useBookmarkTags();
const { selectedFolderName } = useBookmarkFolders();

const { bookmarks, loading, currentPage, totalPages, totalItems, pageSize } =
  useBookmarkList(false);

const hasActiveFilters = computed(
  () =>
    Boolean(searchQuery.value.trim()) ||
    selectedTags.value.length > 0 ||
    Boolean(selectedFolderName.value),
);
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col">
    <div
      v-if="loading && !bookmarks.length"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <CardSkeleton v-for="n in 6" :key="n" />
    </div>

    <div v-else-if="bookmarks.length" class="flex flex-1 flex-col gap-400 pb-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="bookmark in bookmarks" :key="bookmark.id" class="h-full">
          <Card :bookmark="bookmark" />
        </div>
      </div>

      <Pagination
        v-if="totalPages > 1"
        v-model="currentPage"
        class="mt-auto shrink-0"
        :total-pages="totalPages"
        :total-items="totalItems"
        :page-size="pageSize"
      />
    </div>

    <div
      v-else-if="hasActiveFilters"
      class="w-full h-full flex items-center justify-center text-center text-gray-500 dark:text-gray-400 px-200 py-300 sm:px-400 sm:py-400"
    >
      <template v-if="searchQuery.trim()">
        No bookmarks found for "{{ searchQuery.trim() }}".
      </template>
      <template v-else-if="selectedTags.length">
        No bookmarks tagged: {{ selectedTags.join(", ") }}.
      </template>
      <template v-else-if="selectedFolderName">
        No bookmarks in folder "{{ selectedFolderName }}".
      </template>
    </div>

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
