<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import Button from "./ui/Button.vue";
import ActionsDropdown from "./Dropdowns/ActionsDropdown.vue";
import { useDate } from "../composables/useDate";
import type { Bookmark } from "@/types/bookmark.ts";
import EditBookmarkModal from "./modals/EditBookmarkModal.vue";
import ArchivedBookmarkModal from "./modals/ArchivedBookmarkModal.vue";
import UnarchivedBookmarkModal from "./modals/UnarchivedBookmarkModal.vue";
import DeleteBookmarkModal from "./modals/DeleteBookmark.vue";
import { useBookmarks } from "@/composables/useBookmark.ts";
import { useToast } from "@/composables/useToast.ts";

const { formatDate } = useDate();
const toast = useToast();

const props = withDefaults(
  defineProps<{
    bookmark: Bookmark;
    archived?: boolean;
  }>(),
  {
    archived: false,
  },
);

const emit = defineEmits<{
  updated: [];
}>();

const isEditModalOpen = ref(false);
const isArchiveModalOpen = ref(false);
const isUnarchiveModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const { togglePin } = useBookmarks();

const getFaviconUrl = (url: string) => {
  try {
    const domain = new URL(url.startsWith("http") ? url : `https://${url}`)
      .hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
  } catch (e) {
    return "";
  }
};

function openEditModal() {
  isEditModalOpen.value = true;
}

function openArchiveModal() {
  isArchiveModalOpen.value = true;
}

function openUnarchiveModal() {
  isUnarchiveModalOpen.value = true;
}

function openDeleteModal() {
  isDeleteModalOpen.value = true;
}

async function handleTogglePin(id: string) {
  const result = await togglePin(id, props.bookmark.is_pinned);

  if (!result) {
    toast.error("Failed to update pin status.");
    return;
  }

  toast.success(result.is_pinned ? "Bookmark pinned." : "Bookmark unpinned.");
}
</script>

<template>
  <div
    class="flex h-full w-full flex-col overflow-hidden rounded-12 bg-neutral-0 dark:bg-neutral-dark-800"
  >
    <div class="flex flex-1 flex-col gap-200 p-200">
        <div class="flex w-full min-w-0 items-center justify-between gap-150">
          <div class="flex min-w-0 flex-1 items-center gap-150">
            <div
              class="shrink-0 rounded-12 border border-neutral-300 bg-neutral-0 dark:border-neutral-dark-500 dark:bg-neutral-dark-800"
            >
              <img
                :src="getFaviconUrl(bookmark.url)"
                :alt="`${bookmark.title} Favicon`"
                class="h-11 w-11 rounded-8"
              />
            </div>
            <div class="flex min-w-0 flex-1 flex-col items-start gap-050">
              <h2
                class="w-full truncate text-h3 text-neutral-900 dark:text-neutral-dark-0"
                :title="bookmark.title"
              >
                {{ bookmark.title }}
              </h2>

              <p
                class="w-full truncate text-preset-5 text-neutral-600 dark:text-neutral-dark-100"
                :title="bookmark.url"
              >
                {{ bookmark.url }}
              </p>
            </div>
          </div>

          <ActionsDropdown
            class="shrink-0"
            :bookmark="bookmark"
            :archived="archived"
            @edit="openEditModal"
            @toggle-pin="handleTogglePin"
            @archive="openArchiveModal"
            @unarchive="openUnarchiveModal"
            @delete="openDeleteModal"
          />
        </div>

        <div
          class="w-full border-b border-neutral-300 dark:border-neutral-dark-500"
        ></div>

        <div
          class="flex min-h-0 w-full flex-1 flex-col justify-between gap-150"
        >
          <p
            class="line-clamp-4 text-p4 text-neutral-600 dark:text-neutral-dark-100"
          >
            {{ bookmark.description }}
          </p>

          <div
            v-if="bookmark.tags?.length"
            class="flex w-full flex-wrap items-center gap-150"
          >
            <p
              v-for="(tag, index) in bookmark.tags"
              :key="index"
              class="rounded-4 bg-neutral-100 px-100 py-025 dark:bg-neutral-dark-600"
            >
              {{ tag }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="flex shrink-0 items-center justify-between border-t border-neutral-300 px-200 py-150 text-neutral-800 dark:border-neutral-dark-500 dark:text-neutral-dark-100"
      >
        <div class="flex items-center gap-200">
          <p class="flex items-center gap-100">
            <Icon icon="local:icon-visit-count" />
            <span>{{ bookmark.visit_count }}</span>
          </p>
          <p class="flex items-center gap-100">
            <Icon icon="local:icon-last-visited" />
            <span>{{
              bookmark.last_visited
                ? formatDate(bookmark.last_visited)
                : "Never"
            }}</span>
          </p>
          <p class="flex items-center gap-100">
            <Icon icon="local:icon-created" />
            <span>{{ formatDate(bookmark.created_at) }}</span>
          </p>
        </div>

        <Icon v-if="bookmark.is_pinned" icon="local:icon-pin" />

        <p
          v-if="archived"
          class="px-100 py-025 bg-neutral-100 rounded-4 text-preset-5 text-neutral-600 dark:bg-neutral-dark-600 dark:text-neutral-dark-100"
        >
          Archived
        </p>
      </div>

    <EditBookmarkModal
      v-model="isEditModalOpen"
      :bookmark="bookmark"
      @updated="emit('updated')"
    />

    <ArchivedBookmarkModal
      v-if="!archived"
      v-model="isArchiveModalOpen"
      :bookmark="bookmark"
    />

    <UnarchivedBookmarkModal
      v-if="archived"
      v-model="isUnarchiveModalOpen"
      :bookmark="bookmark"
    />

    <DeleteBookmarkModal
      v-if="archived"
      v-model="isDeleteModalOpen"
      :bookmark="bookmark"
    />
  </div>
</template>
