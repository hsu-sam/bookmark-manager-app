<script setup lang="ts">
import { ref, watch } from "vue";
import Input from "@/components/ui/Input.vue";
import Modal from "../ui/Modal.vue";
import Textarea from "@/components/ui/Textarea.vue";
import Button from "../ui/Button.vue";
import { useBookmarks } from "@/services/useBookmark.ts";
import type { Bookmark } from "@/types/bookmark.ts";
import { useToast } from "@/composables/useToast";
import { isValidUrl } from "@/utils/url";

const isOpen = defineModel<boolean>();
const toast = useToast();

const props = defineProps<{
  bookmark: Bookmark;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const { updateBookmark, findDuplicateBookmark } = useBookmarks();

const form = ref({
  title: "",
  description: "",
  url: "",
  tags: "",
});

const duplicateBookmark = ref<Bookmark | null>(null);
let urlDebounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(
  () => props.bookmark,
  (b) => {
    if (!b) return;

    form.value = {
      title: b.title,
      description: b.description ?? "",
      url: b.url,
      tags: b.tags?.join(", ") ?? "",
    };
    duplicateBookmark.value = null;
  },
  { immediate: true },
);

watch(isOpen, (open) => {
  if (!open) {
    duplicateBookmark.value = null;
  }
});

function scheduleDuplicateCheck(nextUrl: string) {
  if (urlDebounceTimer) clearTimeout(urlDebounceTimer);

  urlDebounceTimer = setTimeout(() => {
    const trimmed = nextUrl.trim();

    if (!trimmed || !isValidUrl(trimmed)) {
      duplicateBookmark.value = null;
      return;
    }

    duplicateBookmark.value = findDuplicateBookmark(trimmed, props.bookmark.id);
  }, 300);
}

watch(
  () => form.value.url,
  (nextUrl) => {
    scheduleDuplicateCheck(nextUrl);
  },
);

const handleUpdate = async () => {
  if (!props.bookmark) return;

  if (findDuplicateBookmark(form.value.url, props.bookmark.id)) {
    toast.error("This bookmark URL already exists.");
    return;
  }

  const payload = {
    title: form.value.title,
    description: form.value.description,
    url: form.value.url,
    tags: form.value.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };

  const result = await updateBookmark(props.bookmark.id, payload);

  if (!result) {
    toast.error("Failed to update bookmark.");
    return;
  }

  isOpen.value = false;
  emit("updated");
  toast.success("Bookmark updated successfully!");
};

const handleCloseModal = () => {
  isOpen.value = false;
};
</script>

<template>
  <Modal v-model="isOpen">
    <template #title>
      <h1>Edit Bookmark</h1>
    </template>

    <template #description>
      <p>
        Update your saved link details - change the title, description, URL, or
        tags anytime.
      </p>
    </template>

    <template #main>
      <form class="flex flex-col gap-250" @submit.prevent="handleUpdate">
        <Input
          v-model="form.title"
          name="title"
          label="Title"
          type="text"
          class="w-full"
        />
        <Textarea
          v-model="form.description"
          name="description"
          label="Description"
          class="w-full"
        />

        <Input
          v-model="form.url"
          name="url"
          label="Website URL"
          type="text"
          class="w-full"
        />

        <div
          v-if="duplicateBookmark"
          class="rounded-lg border border-amber-500/60 bg-amber-50 px-150 py-125 text-preset-4 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100"
        >
          This URL already exists as
          <span class="font-semibold">"{{ duplicateBookmark.title }}"</span>.
        </div>

        <Input
          v-model="form.tags"
          name="tags"
          label="Tags (comma separated)"
          type="text"
          class="w-full"
        />

        <div class="flex items-center justify-end gap-200 mt-400">
          <Button variant="secondary" type="button" @click="handleCloseModal">
            Cancel
          </Button>

          <Button type="submit" :disabled="!!duplicateBookmark">
            Save Bookmark
          </Button>
        </div>
      </form>
    </template>
  </Modal>
</template>
