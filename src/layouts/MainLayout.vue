<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
import BookmarkHeader from "@/components/BookmarkHeader.vue";

const route = useRoute();
const sidebarOpen = ref(false);

watch(
  () => route.fullPath,
  () => {
    sidebarOpen.value = false;
  },
);
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <SideBar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Right Section -->
    <div class="flex flex-1 flex-col">
      <!-- Header -->
      <Header @open-sidebar="sidebarOpen = true" />

      <!-- Main Content -->
      <main class="flex-1 flex flex-col gap-250 p-6">
        <BookmarkHeader />
        <router-view />
      </main>
    </div>
  </div>
</template>
