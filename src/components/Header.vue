<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Button from "./ui/Button.vue";
import SearchInput from "./ui/SearchInput.vue";
import AddBookmarkModal from "./modals/AddBookmarkModal.vue";
import ProfileMenu from "./Dropdowns/ProfileMenu.vue";
import { ref } from "vue";

const emit = defineEmits<{ openSidebar: [] }>();
const isAddBookmarkModal = ref(false);

function openAddBookmarkModal() {
  isAddBookmarkModal.value = true;
}
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
      <Button
        class="flex flex-row items-center gap-100"
        @click="openAddBookmarkModal"
      >
        <Icon icon="local:icon-add" class="w-5 h-5" />
        <span class="hidden md:block">Add Bookmark</span>
      </Button>

      <!-- Profile  -->
      <ProfileMenu />
    </div>
  </div>

  <AddBookmarkModal v-model="isAddBookmarkModal" />
</template>
