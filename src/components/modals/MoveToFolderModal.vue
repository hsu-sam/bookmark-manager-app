<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";
import Modal from "@/components/ui/Modal.vue";
import Button from "@/components/ui/Button.vue";
import type { Bookmark } from "@/types/bookmark";
import { useToast } from "@/composables/useToast";
import { useBookmarks } from "@/services/useBookmark";
import { useFolders } from "@/services/useFolder";

const isOpen = defineModel<boolean>();

const props = defineProps<{
  bookmark: Bookmark;
}>();

const toast = useToast();
const { updateBookmark } = useBookmarks();
const { folders } = useFolders();
const loading = ref(false);

const sortedFolders = computed(() =>
  [...folders.value].sort((a, b) => a.name.localeCompare(b.name)),
);

function handleClose() {
  isOpen.value = false;
}

async function moveToFolder(folderId: string | null) {
  loading.value = true;
  const result = await updateBookmark(props.bookmark.id, { folder_id: folderId });
  loading.value = false;

  if (!result) {
    toast.error("Failed to move bookmark.");
    return;
  }

  isOpen.value = false;

  if (folderId) {
    const folderName =
      folders.value.find((folder) => folder.id === folderId)?.name ?? "folder";
    toast.success(`Moved to "${folderName}".`);
    return;
  }

  toast.success("Removed from folder.");
}
</script>

<template>
  <Modal v-model="isOpen">
    <template #title>
      <h1>Move to Folder</h1>
    </template>

    <template #description>
      <p>Choose where to save "{{ bookmark.title }}".</p>
    </template>

    <template #main>
      <div class="flex max-h-80 flex-col gap-050 overflow-y-auto">
        <button
          v-if="bookmark.folder_id"
          type="button"
          class="flex w-full items-center gap-100 rounded-8 px-150 py-125 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-dark-600"
          :disabled="loading"
          @click="moveToFolder(null)"
        >
          <Icon
            icon="lucide:folder-x"
            class="size-4 shrink-0 text-neutral-800 dark:text-neutral-dark-100"
          />
          <span class="text-preset-4 font-medium text-neutral-800 dark:text-neutral-dark-100">
            Remove from folder
          </span>
        </button>

        <button
          v-for="folder in sortedFolders"
          :key="folder.id"
          type="button"
          class="flex w-full items-center gap-100 rounded-8 px-150 py-125 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-dark-600"
          :class="
            bookmark.folder_id === folder.id
              ? 'bg-neutral-100 dark:bg-neutral-dark-600'
              : ''
          "
          :disabled="loading"
          @click="moveToFolder(folder.id)"
        >
          <Icon
            :icon="
              bookmark.folder_id === folder.id
                ? 'lucide:folder-open'
                : 'lucide:folder'
            "
            class="size-4 shrink-0 text-neutral-800 dark:text-neutral-dark-100"
          />
          <span class="text-preset-4 font-medium text-neutral-800 dark:text-neutral-dark-100">
            {{ folder.name }}
          </span>
        </button>

        <p
          v-if="!sortedFolders.length"
          class="px-150 py-100 text-preset-4 text-neutral-500 dark:text-neutral-dark-100"
        >
          No folders yet. Create one from the sidebar.
        </p>
      </div>

      <div class="mt-400 flex items-center justify-end">
        <Button variant="secondary" type="button" @click="handleClose">
          Cancel
        </Button>
      </div>
    </template>
  </Modal>
</template>
