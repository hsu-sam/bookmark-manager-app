<script setup lang="ts">
import Button from "./ui/Button.vue";
import SearchInput from "./ui/SearchInput.vue";
</script>

<template>
  <div
    class="flex items-center px-400 py-200 justify-between bg-neutral-0 w-full h-[78px] border-b border-b-neutral-400"
  >
    <SearchInput class="w-[320px]" placeholder="Search by title..." />

    <div>
      <Button icon="local:icon-add">Add Bookmark</Button>
    </div>
  </div>
</template>
