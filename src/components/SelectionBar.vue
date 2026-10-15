<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import Button from "./ui/Button.vue";
import Dropdown from "./ui/Dropdown.vue";
import type { DropdownItem } from "./ui/Dropdown.vue";
import { useFolders } from "@/services/useFolder";
import {
  useBookmarkSelection,
  useMoveSelectedBookmarks,
} from "@/composables/useBookmarkSelection";

const { folders } = useFolders();
const { count, hasSelection, clearSelection } = useBookmarkSelection();
const { moveSelected, isMoving } = useMoveSelectedBookmarks();

const moveItems = computed<DropdownItem[]>(() => {
  const items: DropdownItem[] = [...folders.value]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((folder) => ({
      label: folder.name,
      icon: "lucide:folder",
      action: () => moveSelected(folder.id),
    }));

  if (items.length) {
    items.push({ label: "", separator: true, action: () => {} });
  }

  items.push({
    label: "Remove from folder",
    icon: "lucide:folder-x",
    action: () => moveSelected(null),
  });

  return items;
});

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape" && hasSelection.value) clearSelection();
}

onMounted(() => window.addEventListener("keydown", handleKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", handleKeydown));
</script>

<template>
  <Transition name="selection-bar">
    <div
      v-if="hasSelection"
      class="fixed inset-x-0 bottom-0 z-40 flex justify-center px-200"
      style="padding-bottom: calc(env(safe-area-inset-bottom, 0px) + 16px)"
    >
      <div
        role="toolbar"
        aria-label="Selected bookmarks"
        class="flex items-center gap-150 rounded-12 border border-neutral-300 bg-neutral-0 py-100 pr-100 pl-200 shadow-lg dark:border-neutral-dark-500 dark:bg-neutral-dark-800"
      >
        <p
          class="whitespace-nowrap text-preset-4 font-semibold text-neutral-900 dark:text-neutral-dark-0"
        >
          {{ count }} selected
        </p>

        <Dropdown
          :items="moveItems"
          align="center"
          content-class="max-h-80 overflow-y-auto"
        >
          <template #trigger>
            <Button type="button" :loading="isMoving" :disabled="isMoving">
              <Icon icon="lucide:folder-input" class="size-4" />
              Move to…
            </Button>
          </template>
        </Dropdown>

        <Button
          type="button"
          variant="secondary"
          aria-label="Clear selection"
          @click="clearSelection"
        >
          <Icon icon="local:icon-close" class="size-4" />
        </Button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.selection-bar-enter-active,
.selection-bar-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.selection-bar-enter-from,
.selection-bar-leave-to {
  transform: translateY(16px);
  opacity: 0;
}
</style>
