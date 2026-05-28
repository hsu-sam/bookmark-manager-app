<script setup>
import Header from "@/components/Header.vue";
import SideBar from "@/components/SideBar.vue";
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <SideBar />

    <!-- Right Section -->
    <div class="flex flex-1 flex-col">
      <!-- Header -->
      <Header />

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>
