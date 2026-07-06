<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import BookmarkHeader from "@/components/BookmarkHeader.vue";
import { useBookmarkTags } from "@/composables/useBookmarkTags";

const route = useRoute();
const sidebarOpen = ref(false);
const { clearTags } = useBookmarkTags();

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
  },
);
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <SideBar :is-open="sidebarOpen" @close="closeSidebar" />

    <!-- Right Section -->
    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
      <!-- Header -->
      <div class="shrink-0">
        <Header @open-sidebar="openSidebar" />
      </div>

      <div class="shrink-0 px-6 pt-6">
        <BookmarkHeader />
      </div>

      <!-- Main Content -->
      <main class="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-6 pt-250">
        <div class="flex min-h-full flex-1 flex-col">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>
