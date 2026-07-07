import { computed, ref } from "vue";
import type { Bookmark } from "@/types/bookmark";
import { UNCATEGORIZED_FOLDER_ID } from "@/types/folder";
import { useFolders } from "@/services/useFolder";

const selectedFolderId = ref<string | null>(null);

export function useBookmarkFolders() {
  const { folders, getFolderById } = useFolders();

  const selectedFolderName = computed(() => {
    if (!selectedFolderId.value) return null;
    if (selectedFolderId.value === UNCATEGORIZED_FOLDER_ID) {
      return "Uncategorized";
    }
    return getFolderById(selectedFolderId.value)?.name ?? "Folder";
  });

  const hasActiveFolderFilter = computed(() => Boolean(selectedFolderId.value));

  const selectFolder = (id: string) => {
    selectedFolderId.value = selectedFolderId.value === id ? null : id;
  };

  const clearFolder = () => {
    selectedFolderId.value = null;
  };

  const filterBookmarksByFolder = (bookmarks: Bookmark[]) => {
    if (!selectedFolderId.value) return bookmarks;

    if (selectedFolderId.value === UNCATEGORIZED_FOLDER_ID) {
      return bookmarks.filter((bookmark) => !bookmark.folder_id);
    }

    return bookmarks.filter(
      (bookmark) => bookmark.folder_id === selectedFolderId.value,
    );
  };

  return {
    selectedFolderId,
    selectedFolderName,
    hasActiveFolderFilter,
    folders,
    selectFolder,
    clearFolder,
    filterBookmarksByFolder,
  };
}
