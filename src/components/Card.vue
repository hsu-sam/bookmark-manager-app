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
  <div class="bg-neutral-0 rounded-12 w-full">
    <div class="flex flex-col justify-between h-full">
      <div class="flex flex-col items-center gap-200 p-200">
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-150">
            <div class="rounded-12 border border-neutral-300 bg-neutral-0">
              <img
                :src="getFaviconUrl(bookmark.url)"
                :alt="`${bookmark.title} Favicon`"
                class="w-11 h-11 rounded-8"
              />
            </div>
            <div class="flex flex-col items-start gap-050">
              <h2 class="text-h3 text-neutral-900">{{ bookmark.title }}</h2>

              <p class="text-preset-5 text-neutral-600">{{ bookmark.url }}</p>
            </div>
          </div>

          <ActionsDropdown
            :bookmark="bookmark"
            :archived="archived"
            @edit="openEditModal"
            @toggle-pin="handleTogglePin"
            @archive="openArchiveModal"
            @unarchive="openUnarchiveModal"
            @delete="openDeleteModal"
          />
        </div>

        <div class="w-full border-b border-neutral-300"></div>

        <p class="text-p4 text-neutral-600">
          {{ bookmark.description }}
        </p>

        <div class="flex flex-wrap items-center gap-150 w-full">
          <p
            v-for="(tag, index) in bookmark.tags"
            :key="index"
            class="px-100 py-025 bg-neutral-100 rounded-4"
          >
            {{ tag }}
          </p>
        </div>
      </div>

      <div
        class="flex items-center justify-between px-200 py-150 border-t border-neutral-300"
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
          class="px-100 py-025 bg-neutral-100 rounded-4 text-preset-5 text-neutral-600"
        >
          Archived
        </p>
      </div>
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
