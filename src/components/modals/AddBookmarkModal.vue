<script setup lang="ts">
import { ref, watch } from "vue";
import Input from "@/components/ui/Input.vue";
import Modal from "../ui/Modal.vue";
import Textarea from "@/components/ui/Textarea.vue";
import Button from "../ui/Button.vue";
import { useToast } from "@/composables/useToast";
import { requiredRule } from "@/schemas/bookmark.schemas.ts";
import { useFieldValue, useForm } from "vee-validate";
import { useBookmarks } from "@/services/useBookmark.ts";
import { useFetchMetadata } from "@/services/useFetchMetadata.ts";
import { useBookmarkFolders } from "@/composables/useBookmarkFolders";
import { UNCATEGORIZED_FOLDER_ID } from "@/types/folder";
import { isValidUrl } from "@/utils/url";
import type { Bookmark } from "@/types/bookmark.ts";

const toast = useToast();
const { addBookmark, findDuplicateBookmark } = useBookmarks();
const { fetchMetadata, isFetchingMetadata } = useFetchMetadata();
const { selectedFolderId } = useBookmarkFolders();

const isOpen = defineModel<boolean>();
const loading = ref(false);
const duplicateBookmark = ref<Bookmark | null>(null);

let urlDebounceTimer: ReturnType<typeof setTimeout> | null = null;

const { handleSubmit, setFieldValue, resetForm } = useForm({
  validationSchema: {
    title: requiredRule("Title"),
    url: requiredRule("Website URL"),
    description: requiredRule("Description"),
    tags: requiredRule("Tags"),
  },
});

const url = useFieldValue<string>("url");
const title = useFieldValue<string>("title");
const description = useFieldValue<string>("description");

watch(isOpen, (open) => {
  if (!open) {
    duplicateBookmark.value = null;
    resetForm();
  }
});

function scheduleUrlProcessing(nextUrl: string) {
  if (urlDebounceTimer) clearTimeout(urlDebounceTimer);

  urlDebounceTimer = setTimeout(async () => {
    const trimmed = nextUrl.trim();

    if (!trimmed || !isValidUrl(trimmed)) {
      duplicateBookmark.value = null;
      return;
    }

    duplicateBookmark.value = findDuplicateBookmark(trimmed);
    if (duplicateBookmark.value) return;

    const metadata = await fetchMetadata(trimmed);
    if (!metadata) return;

    if (!title.value?.trim() && metadata.title) {
      setFieldValue("title", metadata.title);
    }

    if (!description.value?.trim() && metadata.description) {
      setFieldValue("description", metadata.description);
    }
  }, 500);
}

watch(url, (nextUrl) => {
  if (typeof nextUrl === "string") {
    scheduleUrlProcessing(nextUrl);
  }
});

const handleCloseModal = () => {
  isOpen.value = false;
};

const onSubmit = handleSubmit(async (values) => {
  if (findDuplicateBookmark(values.url)) {
    toast.error("This bookmark URL already exists.");
    return;
  }

  loading.value = true;

  const folderId =
    selectedFolderId.value && selectedFolderId.value !== UNCATEGORIZED_FOLDER_ID
      ? selectedFolderId.value
      : null;

  const bookmark = await addBookmark({
    title: values.title,
    url: values.url,
    description: values.description,
    tags: values.tags
      .split(",")
      .map((tag: string) => tag.trim())
      .filter(Boolean),
    folder_id: folderId,
  });
  loading.value = false;

  if (!bookmark) {
    toast.error("Failed to add bookmark.");
    return;
  }

  isOpen.value = false;
  toast.success("Bookmark added successfully!");
});
</script>

<template>
  <Modal v-model="isOpen">
    <template #title><h1>Add Bookmark</h1></template>
    <template #description>
      <p>
        Paste a URL and we will fetch the title and description automatically.
      </p>
    </template>

    <template #main>
      <form action="" class="flex flex-col gap-250" @submit="onSubmit">
        <Input name="title" label="Title" type="text" class="w-full" />
        <Textarea
          name="description"
          label="Description"
          type="text"
          class="full"
        />
        <Input name="url" label="Website URL" type="text" class="w-full" />

        <p
          v-if="isFetchingMetadata"
          class="text-preset-4 text-neutral-600 dark:text-neutral-dark-100"
        >
          Fetching page details...
        </p>

        <div
          v-if="duplicateBookmark"
          class="rounded-lg border border-amber-500/60 bg-amber-50 px-150 py-125 text-preset-4 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100"
        >
          This URL already exists as
          <span class="font-semibold">"{{ duplicateBookmark.title }}"</span>.
        </div>

        <Input
          name="tags"
          label="Tags (comma separated)"
          type="text"
          class="w-full"
        />

        <div class="flex items-center justify-end gap-200 mt-400">
          <Button variant="secondary" type="button" @click="handleCloseModal">
            Cancel
          </Button>
          <Button
            type="submit"
            :loading="loading"
            :disabled="!!duplicateBookmark"
          >
            Add Bookmark
          </Button>
        </div>
      </form>
    </template>
  </Modal>
</template>
