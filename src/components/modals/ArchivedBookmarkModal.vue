<script setup lang="ts">
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import type { Bookmark } from "@/types/bookmark";
import { useArchiveBookmark } from "@/services/useBookmark.ts";
import { useToast } from "@/composables/useToast";

const isOpen = defineModel<boolean>();

const props = defineProps<{
  bookmark: Bookmark;
}>();

const archiveBookmarkMutation = useArchiveBookmark();
const toast = useToast();

function handleClose() {
  isOpen.value = false;
}

async function handleConfirm() {
  try {
    await archiveBookmarkMutation.mutateAsync(props.bookmark.id);
    isOpen.value = false;
    toast.success("Bookmark archived.");
  } catch {
    toast.error("Failed to archive bookmark.");
  }
}
</script>

<template>
  <Modal v-model="isOpen">
    <template #title>
      <h1>Archive bookmark</h1>
    </template>

    <template #description>
      <p>Are you sure you want to archive this bookmark?</p>
    </template>

    <template #main>
      <div class="flex items-center justify-end gap-200">
        <Button variant="secondary" type="button" @click="handleClose">
          Cancel
        </Button>
        <Button
          type="button"
          :loading="archiveBookmarkMutation.isPending.value"
          @click="handleConfirm"
        >
          Archive
        </Button>
      </div>
    </template>
  </Modal>
</template>
