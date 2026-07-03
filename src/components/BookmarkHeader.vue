<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import SortDropdown from "./Dropdowns/SortDropdown.vue";
import { useBookmarkSort } from "@/composables/useBookmarkSort";

const route = useRoute();
const { sortBy } = useBookmarkSort();

const title = computed(() =>
  route.name === "user.archived" ? "Archived Bookmarks" : "All Bookmarks",
);
</script>

<template>
  <div class="flex items-center justify-between">
    <h1>{{ title }}</h1>

    <SortDropdown v-model="sortBy" />
  </div>
</template>
