<script setup lang="ts">
import { ref } from "vue";
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import type { Bookmark } from "@/types/bookmark";
import { useBookmarks } from "@/services/useBookmark.ts";
import { useToast } from "@/composables/useToast";

const isOpen = defineModel<boolean>();

const props = defineProps<{
  bookmark: Bookmark;
}>();

const { unarchiveBookmark } = useBookmarks();
const toast = useToast();
const loading = ref(false);

function handleClose() {
  isOpen.value = false;
}

async function handleConfirm() {
  loading.value = true;
  const result = await unarchiveBookmark(props.bookmark.id);
  loading.value = false;

  if (!result) {
    toast.error("Failed to restore bookmark.");
    return;
  }

  isOpen.value = false;
  toast.success("Bookmark restored.");
}
</script>

<template>
  <Modal v-model="isOpen">
    <template #title>
      <h1>Unarchive bookmark</h1>
    </template>

    <template #description>
      <p>Move this bookmark to your active list?</p>
    </template>

    <template #main>
      <div class="flex items-center justify-end gap-200">
        <Button variant="secondary" type="button" @click="handleClose">
          Cancel
        </Button>
        <Button type="button" :loading="loading" @click="handleConfirm">
          Unarchive
        </Button>
      </div>
    </template>
  </Modal>
</template>
