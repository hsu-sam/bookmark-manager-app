<script setup lang="ts">
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import type { Bookmark } from "@/types/bookmark";
import { useDeleteBookmark } from "@/services/useBookmark.ts";
import { useToast } from "@/composables/useToast";

const isOpen = defineModel<boolean>();

const props = defineProps<{
  bookmark: Bookmark;
}>();

const deleteBookmarkMutation = useDeleteBookmark();
const toast = useToast();

function handleClose() {
  isOpen.value = false;
}

async function handleConfirm() {
  try {
    await deleteBookmarkMutation.mutateAsync(props.bookmark.id);
    isOpen.value = false;
    toast.success("Bookmark deleted.");
  } catch {
    toast.error("Failed to delete bookmark.");
  }
}
</script>

<template>
  <Modal v-model="isOpen">
    <template #title>
      <h1>Delete bookmark</h1>
    </template>

    <template #description>
      <p>Are you sure you want to delete this bookmark?</p>
    </template>

    <template #main>
      <div class="flex items-center justify-end gap-200">
        <Button variant="secondary" type="button" @click="handleClose">
          Cancel
        </Button>
        <Button
          variant="danger"
          type="button"
          :loading="deleteBookmarkMutation.isPending.value"
          @click="handleConfirm"
        >
          Delete permanently
        </Button>
      </div>
    </template>
  </Modal>
</template>
