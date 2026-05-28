<script setup lang="ts">
import Tags from "./ui/Tags.vue";
</script>

<template>
  <div
    class="flex flex-col gap-200 bg-neutral-0 w-[296px] h-screen border-r border-neutral-400"
  >
    <div class="pt-250 px-250 pb-125">Sidebar</div>
    <div class="flex flex-col gap-200 pt-0 pb-250 px-200">
      <div class="">
        <h1>Home</h1>
        <h1>Archived</h1>
      </div>
      <Tags />
    </div>
  </div>
</template>
