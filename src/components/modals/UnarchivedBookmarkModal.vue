<script setup lang="ts">
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import type { Bookmark } from "@/types/bookmark";
import { useUnarchiveBookmark } from "@/services/useBookmark.ts";
import { useToast } from "@/composables/useToast";

const isOpen = defineModel<boolean>();

const props = defineProps<{
  bookmark: Bookmark;
}>();

const unarchiveBookmarkMutation = useUnarchiveBookmark();
const toast = useToast();

function handleClose() {
  isOpen.value = false;
}

async function handleConfirm() {
  try {
    await unarchiveBookmarkMutation.mutateAsync(props.bookmark.id);
    isOpen.value = false;
    toast.success("Bookmark restored.");
  } catch {
    toast.error("Failed to restore bookmark.");
  }
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
        <Button
          type="button"
          :loading="unarchiveBookmarkMutation.isPending.value"
          @click="handleConfirm"
        >
          Unarchive
        </Button>
      </div>
    </template>
  </Modal>
</template>
