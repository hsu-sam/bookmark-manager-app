<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import Modal from "@/components/ui/Modal.vue";
import Button from "@/components/ui/Button.vue";
import { useToast } from "@/composables/useToast";
import { supabase } from "@/utils/supabase";
import { useDeleteFolder } from "@/services/useFolder";
import { useBookmarkFolders } from "@/composables/useBookmarkFolders";
import type { Folder } from "@/types/folder";

const isOpen = defineModel<boolean>();

const props = defineProps<{
  folder: Folder;
}>();

const toast = useToast();
const deleteFolderMutation = useDeleteFolder();
const { selectedFolderId, clearFolder } = useBookmarkFolders();

const countQuery = useQuery({
  queryKey: computed(() => ["folder-bookmark-count", props.folder.id] as const),
  queryFn: async () => {
    const { count } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact", head: true })
      .eq("folder_id", props.folder.id);
    return count ?? 0;
  },
  enabled: computed(() => Boolean(isOpen.value)),
});
const bookmarkCount = computed(() => countQuery.data.value ?? 0);

function handleClose() {
  isOpen.value = false;
}

async function handleConfirm() {
  try {
    await deleteFolderMutation.mutateAsync(props.folder.id);

    if (selectedFolderId.value === props.folder.id) {
      clearFolder();
    }

    isOpen.value = false;
    toast.success(`Folder "${props.folder.name}" deleted.`);
  } catch {
    toast.error("Failed to delete folder.");
  }
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
          :loading="deleteFolderMutation.isPending.value"
          @click="handleConfirm"
        >
          Delete folder
        </Button>
      </div>
    </template>
  </Modal>
</template>
