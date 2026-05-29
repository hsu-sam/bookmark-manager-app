<script setup>
import { ref } from "vue";
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";

const sidebarOpen = ref(false);
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <SideBar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <!-- Right Section -->
    <div class="flex flex-1 flex-col">
      <!-- Header -->
      <Header @open-sidebar="sidebarOpen = true" />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
