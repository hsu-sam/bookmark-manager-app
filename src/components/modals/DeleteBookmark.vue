<script setup lang="ts">
import { ref } from "vue";
import Modal from "../ui/Modal.vue";
import Button from "../ui/Button.vue";
import type { Bookmark } from "@/types/bookmark";
import { useBookmarks } from "@/composables/useBookmark";
import { useToast } from "@/composables/useToast";

const isOpen = defineModel<boolean>();

const props = defineProps<{
  bookmark: Bookmark;
}>();

const { deleteBookmark } = useBookmarks();
const toast = useToast();
const loading = ref(false);

function handleClose() {
  isOpen.value = false;
}

async function handleConfirm() {
  loading.value = true;
  const success = await deleteBookmark(props.bookmark.id);
  loading.value = false;

  if (!success) {
    toast.error("Failed to delete bookmark.");
    return;
  }

  isOpen.value = false;
  toast.success("Bookmark deleted.");
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
          :loading="loading"
          @click="handleConfirm"
        >
          Delete permanently
        </Button>
      </div>
    </template>
  </Modal>
</template>
