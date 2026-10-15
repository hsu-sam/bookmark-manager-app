import { computed, ref } from "vue";
import { useToast } from "@/composables/useToast";
import { useMoveBookmarks } from "@/services/useBookmark";
import { useFolders } from "@/services/useFolder";

const selectedIds = ref<Set<string>>(new Set());

export function useBookmarkSelection() {
  const count = computed(() => selectedIds.value.size);
  const hasSelection = computed(() => selectedIds.value.size > 0);

  const isSelected = (id: string) => selectedIds.value.has(id);

  const toggle = (id: string) => {
    const next = new Set(selectedIds.value);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    selectedIds.value = next;
  };

  const clearSelection = () => {
    if (selectedIds.value.size) selectedIds.value = new Set();
  };

  return {
    selectedIds,
    count,
    hasSelection,
    isSelected,
    toggle,
    clearSelection,
  };
}

export function useMoveSelectedBookmarks() {
  const toast = useToast();
  const moveMutation = useMoveBookmarks();
  const { folders } = useFolders();
  const { selectedIds, clearSelection } = useBookmarkSelection();

  const moveSelected = async (folderId: string | null) => {
    const ids = [...selectedIds.value];
    if (!ids.length || moveMutation.isPending.value) return;

    try {
      await moveMutation.mutateAsync({ ids, folderId });
      clearSelection();

      const noun = ids.length === 1 ? "bookmark" : "bookmarks";
      if (folderId) {
        const folderName =
          folders.value.find((folder) => folder.id === folderId)?.name ??
          "folder";
        toast.success(`Moved ${ids.length} ${noun} to "${folderName}".`);
        return;
      }

      toast.success(`Removed ${ids.length} ${noun} from folder.`);
    } catch {
      toast.error("Failed to move bookmarks.");
    }
  };

  return {
    moveSelected,
    isMoving: moveMutation.isPending,
  };
}
