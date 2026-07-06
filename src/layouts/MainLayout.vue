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
  <div class="flex h-screen">
    <!-- Sidebar -->
    <SideBar :is-open="sidebarOpen" @close="closeSidebar" />

    <!-- Right Section -->
    <div class="flex flex-1 flex-col">
      <!-- Header -->
      <Header @open-sidebar="openSidebar" />

      <!-- Main Content -->
      <main class="flex-1 flex flex-col gap-250 p-6">
        <BookmarkHeader />
        <router-view />
      </main>
    </div>
  </div>
</template>
