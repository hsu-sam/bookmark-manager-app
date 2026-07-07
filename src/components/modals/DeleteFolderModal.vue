<script setup lang="ts">
import { computed, ref } from "vue";
import Modal from "@/components/ui/Modal.vue";
import Button from "@/components/ui/Button.vue";
import { useToast } from "@/composables/useToast";
import { useBookmarks } from "@/services/useBookmark";
import { useFolders } from "@/services/useFolder";
import { useBookmarkFolders } from "@/composables/useBookmarkFolders";
import type { Folder } from "@/types/folder";

const isOpen = defineModel<boolean>();

const props = defineProps<{
  folder: Folder;
}>();

const toast = useToast();
const { bookmarks } = useBookmarks();
const { deleteFolder } = useFolders();
const { selectedFolderId, clearFolder } = useBookmarkFolders();
const loading = ref(false);

const bookmarkCount = computed(
  () =>
    bookmarks.value.filter((bookmark) => bookmark.folder_id === props.folder.id)
      .length,
);

function handleClose() {
  isOpen.value = false;
}

async function handleConfirm() {
  loading.value = true;
  const success = await deleteFolder(props.folder.id);
  loading.value = false;

  if (!success) {
    toast.error("Failed to delete folder.");
    return;
  }

  bookmarks.value = bookmarks.value.map((bookmark) =>
    bookmark.folder_id === props.folder.id
      ? { ...bookmark, folder_id: null }
      : bookmark,
  );

  if (selectedFolderId.value === props.folder.id) {
    clearFolder();
  }

  isOpen.value = false;
  toast.success(`Folder "${props.folder.name}" deleted.`);
}
</script>

<template>
  <Modal v-model="isOpen">
    <template #title>
      <h1>Delete Folder</h1>
    </template>

    <template #description>
      <p>
        Are you sure you want to delete "{{ folder.name }}"?
        <template v-if="bookmarkCount">
          {{ bookmarkCount }} bookmark{{ bookmarkCount === 1 ? "" : "s" }}
          will be moved to Uncategorized.
        </template>
      </p>
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
          Delete folder
        </Button>
      </div>
    </template>
  </Modal>
</template>
