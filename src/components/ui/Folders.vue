<script setup lang="ts">
import { computed, ref } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";
import SidebarSection from "./SidebarSection.vue";
import Dropdown from "./Dropdown.vue";
import CreateFolderModal from "@/components/modals/CreateFolderModal.vue";
import EditFolderModal from "@/components/modals/EditFolderModal.vue";
import DeleteFolderModal from "@/components/modals/DeleteFolderModal.vue";
import { useBookmarks } from "@/services/useBookmark";
import { useFolders } from "@/services/useFolder";
import { useBookmarkFolders } from "@/composables/useBookmarkFolders";
import { UNCATEGORIZED_FOLDER_ID } from "@/types/folder";
import type { Folder } from "@/types/folder";
import type { DropdownItem } from "./Dropdown.vue";

const emit = defineEmits<{
  select: [];
}>();

const route = useRoute();
const { bookmarks } = useBookmarks();
const { folders } = useFolders();
const {
  selectedFolderId,
  selectFolder,
  clearFolder,
  hasActiveFolderFilter,
} = useBookmarkFolders();

const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const activeFolder = ref<Folder | null>(null);

const scopedBookmarks = computed(() => {
  const isArchived = route.name === "user.archived";
  return bookmarks.value.filter((bookmark) =>
    isArchived ? bookmark.is_archived : !bookmark.is_archived,
  );
});

const folderRows = computed(() =>
  [...folders.value]
    .map((folder) => ({
      ...folder,
      count: scopedBookmarks.value.filter(
        (bookmark) => bookmark.folder_id === folder.id,
      ).length,
    }))
    .sort((a, b) => a.name.localeCompare(b.name)),
);

const uncategorizedCount = computed(
  () =>
    scopedBookmarks.value.filter((bookmark) => !bookmark.folder_id).length,
);

const hasFolders = computed(
  () => folders.value.length > 0 || uncategorizedCount.value > 0,
);

function handleFolderClick(id: string) {
  selectFolder(id);
  emit("select");
}

function handleUncategorizedClick() {
  selectFolder(UNCATEGORIZED_FOLDER_ID);
  emit("select");
}

function handleReset() {
  clearFolder();
  emit("select");
}

function openCreateModal() {
  isCreateModalOpen.value = true;
}

function openEditModal(folder: Folder) {
  activeFolder.value = folder;
  isEditModalOpen.value = true;
}

function openDeleteModal(folder: Folder) {
  activeFolder.value = folder;
  isDeleteModalOpen.value = true;
}

function getFolderMenuItems(folder: Folder): DropdownItem[] {
  return [
    {
      label: "Rename",
      icon: "local:icon-edit",
      action: () => openEditModal(folder),
    },
    {
      label: "Delete",
      icon: "local:icon-delete",
      danger: true,
      action: () => openDeleteModal(folder),
    },
  ];
}
</script>

<template>
  <SidebarSection title="Folders" :default-open="false">
    <template #actions>
      <button
        v-if="hasActiveFolderFilter"
        type="button"
        class="px-100 text-preset-5 font-semibold text-neutral-800 hover:text-neutral-900 dark:text-neutral-dark-100 dark:hover:text-neutral-dark-0"
        @click.stop="handleReset"
      >
        Reset
      </button>
      <button
        type="button"
        class="flex size-7 items-center justify-center rounded-6 text-neutral-800 transition-colors hover:bg-neutral-100 dark:text-neutral-dark-100 dark:hover:bg-neutral-dark-600"
        aria-label="Create folder"
        @click.stop="openCreateModal"
      >
        <Icon icon="local:icon-add" class="size-4" />
      </button>
    </template>

    <div v-if="hasFolders" class="flex flex-col gap-050">
      <div
        v-for="folder in folderRows"
        :key="folder.id"
        class="group flex min-w-0 items-center gap-050 rounded-8"
        :class="
          selectedFolderId === folder.id
            ? 'bg-neutral-100 dark:bg-neutral-dark-600'
            : ''
        "
      >
        <button
          type="button"
          class="flex min-w-0 flex-1 items-center gap-100 px-150 py-100 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-dark-600"
          :class="
            selectedFolderId === folder.id
              ? 'text-neutral-900 dark:text-neutral-dark-0'
              : 'text-neutral-800 dark:text-neutral-dark-100'
          "
          @click="handleFolderClick(folder.id)"
        >
          <Icon
            :icon="
              selectedFolderId === folder.id
                ? 'lucide:folder-open'
                : 'lucide:folder'
            "
            class="size-4 shrink-0"
          />

          <span class="min-w-0 flex-1 truncate text-preset-4 font-medium">
            {{ folder.name }}
          </span>

          <span
            class="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-preset-5 font-semibold text-neutral-800 dark:bg-neutral-dark-600 dark:text-neutral-dark-0"
          >
            {{ folder.count }}
          </span>
        </button>

        <Dropdown :items="getFolderMenuItems(folder)" align="end">
          <template #trigger>
            <button
              type="button"
              class="mr-050 flex size-7 shrink-0 items-center justify-center rounded-6 text-neutral-800 opacity-0 transition-opacity hover:bg-neutral-100 group-hover:opacity-100 dark:text-neutral-dark-100 dark:hover:bg-neutral-dark-500"
              :class="selectedFolderId === folder.id ? 'opacity-100' : ''"
              aria-label="Folder options"
              @click.stop
            >
              <Icon icon="local:icon-menu-bookmark" class="size-4" />
            </button>
          </template>
        </Dropdown>
      </div>

      <button
        v-if="uncategorizedCount > 0"
        type="button"
        class="flex w-full min-w-0 items-center gap-100 rounded-8 px-150 py-100 text-left transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-dark-600"
        :class="
          selectedFolderId === UNCATEGORIZED_FOLDER_ID
            ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-dark-600 dark:text-neutral-dark-0'
            : 'text-neutral-800 dark:text-neutral-dark-100'
        "
        @click="handleUncategorizedClick"
      >
        <Icon icon="lucide:inbox" class="size-4 shrink-0" />

        <span class="min-w-0 flex-1 truncate text-preset-4 font-medium">
          Uncategorized
        </span>

        <span
          class="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-preset-5 font-semibold text-neutral-800 dark:bg-neutral-dark-600 dark:text-neutral-dark-0"
        >
          {{ uncategorizedCount }}
        </span>
      </button>
    </div>

    <div v-else class="flex flex-col gap-100 px-150">
      <p class="text-preset-4 text-neutral-500 dark:text-neutral-dark-100">
        No folders yet
      </p>
      <button
        type="button"
        class="flex items-center gap-100 rounded-8 py-100 text-preset-4 font-medium text-teal-700 transition-colors hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
        @click="openCreateModal"
      >
        <Icon icon="local:icon-add" class="size-4" />
        Create folder
      </button>
    </div>
  </SidebarSection>

  <CreateFolderModal v-model="isCreateModalOpen" />

  <EditFolderModal
    v-if="activeFolder"
    v-model="isEditModalOpen"
    :folder="activeFolder"
  />

  <DeleteFolderModal
    v-if="activeFolder"
    v-model="isDeleteModalOpen"
    :folder="activeFolder"
  />
</template>
