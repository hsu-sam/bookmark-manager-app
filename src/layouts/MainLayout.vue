<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import BookmarkHeader from "@/components/BookmarkHeader.vue";
import SelectionBar from "@/components/SelectionBar.vue";
import { useBookmarkTags } from "@/composables/useBookmarkTags";
import { useBookmarkFolders } from "@/composables/useBookmarkFolders";
import { useBookmarkSelection } from "@/composables/useBookmarkSelection";

const route = useRoute();
const sidebarOpen = ref(false);
const { clearTags } = useBookmarkTags();
const { clearFolder } = useBookmarkFolders();
const { hasSelection, clearSelection } = useBookmarkSelection();

function closeSidebar() {
  sidebarOpen.value = false;
}

function openSidebar() {
  sidebarOpen.value = true;
}

watch(
  () => route.fullPath,
  () => {
    closeSidebar();
    clearTags();
    clearFolder();
    clearSelection();
  },
);
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <SideBar :is-open="sidebarOpen" @close="closeSidebar" />

    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div class="shrink-0">
        <Header @open-sidebar="openSidebar" />
      </div>

      <div class="shrink-0 px-6 pt-6">
        <BookmarkHeader />
      </div>

      <main
        class="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pt-250"
        :class="hasSelection ? 'pb-24' : 'pb-6'"
      >
        <div class="flex min-h-full flex-1 flex-col">
          <router-view />
        </div>
      </main>
    </div>

    <SelectionBar />
  </div>
</template>
