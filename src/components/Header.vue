<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Button from "./ui/Button.vue";
import SearchInput from "./ui/SearchInput.vue";

const emit = defineEmits<{ openSidebar: [] }>();
</script>

<template>
  <div
    class="flex items-center px-200 py-150 md:px-400 md:py-200 gap-125 justify-between bg-neutral-0 w-full h-19.5 border-b border-b-neutral-400"
  >
    <div class="flex items-center gap-125 lg:gap-200">
      <Button @click="emit('openSidebar')" class="lg:hidden"
        ><Icon icon="local:icon-menu-hamburger"
      /></Button>
      <SearchInput class="md:min-w-[320px]" placeholder="Search by title..." />
    </div>

    <div class="flex items-center gap-125 md:gap-200">
      <Button class="flex flex-row items-center gap-100">
        <Icon icon="local:icon-add" class="w-5 h-5" />
        <span class="hidden md:block">Add Bookmark</span>
      </Button>

      <div class="border border-neutral-400 rounded-full p-100 w-fit">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
