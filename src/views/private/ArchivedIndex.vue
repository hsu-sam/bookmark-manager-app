<script setup lang="ts">
import { computed, onMounted } from "vue";
import { motion } from "motion-v";
import Card from "@/components/Card.vue";
import { useFolders } from "@/services/useFolder";
import { useBookmarkSearch } from "@/composables/useBookmarkSearch";
import { useBookmarkTags } from "@/composables/useBookmarkTags";
import { useBookmarkFolders } from "@/composables/useBookmarkFolders";
import EmptyBookmark from "@/components/illustrations/EmptyBookmark.vue";
import CardSkeleton from "@/components/Skeletons/CardSkeleton.vue";
import Pagination from "@/components/ui/Pagination.vue";
import { useBookmarkList } from "@/composables/useBookmarkList";
import { useCardStaggerMotion } from "@/composables/useCardStaggerMotion";

const { fetchFolders } = useFolders();
const { searchQuery } = useBookmarkSearch();
const { selectedTags } = useBookmarkTags();
const { selectedFolderName } = useBookmarkFolders();
const { cardInitial, cardAnimate, cardTransition } = useCardStaggerMotion();

const { bookmarks, loading, currentPage, totalPages, totalItems, pageSize } =
  useBookmarkList(true);

const hasActiveFilters = computed(
  () =>
    Boolean(searchQuery.value.trim()) ||
    selectedTags.value.length > 0 ||
    Boolean(selectedFolderName.value),
);

onMounted(() => {
  fetchFolders();
});
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col">
    <div
      v-if="loading && !bookmarks.length"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <CardSkeleton v-for="n in 6" :key="n" />
    </div>

    <div v-else-if="bookmarks.length" class="flex flex-1 flex-col gap-400">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          v-for="(bookmark, index) in bookmarks"
          :key="bookmark.id"
          class="h-full"
          :initial="cardInitial"
          :animate="cardAnimate"
          :transition="cardTransition(index)"
        >
          <Card :bookmark="bookmark" archived />
        </motion.div>
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

    <p
      v-else-if="hasActiveFilters"
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
