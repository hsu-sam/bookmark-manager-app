<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useForm, useFieldValue } from "vee-validate";
import Input from "@/components/ui/Input.vue";
import Textarea from "@/components/ui/Textarea.vue";
import Button from "@/components/ui/Button.vue";
import { requiredRule } from "@/schemas/bookmark.schemas.ts";
import { useAddBookmark, findDuplicateBookmark } from "@/services/useBookmark.ts";
import { useFetchMetadata } from "@/services/useFetchMetadata.ts";
import { useFolders } from "@/services/useFolder.ts";
import { UNCATEGORIZED_FOLDER_ID } from "@/types/folder";
import type { Bookmark } from "@/types/bookmark.ts";
import { scrapeMetadata, type ScrapedMetadata } from "../lib/scrapeMetadata";

const addBookmarkMutation = useAddBookmark();
const { fetchMetadata } = useFetchMetadata();
const { folders } = useFolders();

const isLoadingTab = ref(true);
const isSaved = ref(false);
const errorMessage = ref<string | null>(null);
const duplicateBookmark = ref<Bookmark | null>(null);
const fetchedFaviconUrl = ref<string | null>(null);
const selectedFolderId = ref<string>(UNCATEGORIZED_FOLDER_ID);
let activeTabId: number | undefined;

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: {
    title: requiredRule("Title"),
    url: requiredRule("Page URL"),
    description: requiredRule("Description"),
    tags: requiredRule("Tags"),
  },
});

const title = useFieldValue<string>("title");
const description = useFieldValue<string>("description");

async function scrapeViaContentScript(tabId: number): Promise<ScrapedMetadata | null> {
  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId },
      func: scrapeMetadata,
    });
    return injection?.result ?? null;
  } catch {
    return null;
  }
}

function applyMetadata(metadata: ScrapedMetadata) {
  fetchedFaviconUrl.value = metadata.faviconUrl;

  if (!title.value?.trim() && metadata.title) {
    setFieldValue("title", metadata.title);
  }

  if (!description.value?.trim() && metadata.description) {
    setFieldValue("description", metadata.description);
  }
}

onMounted(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const pageUrl = tab?.url ?? "";
  activeTabId = tab?.id;

  setFieldValue("url", pageUrl);
  if (tab?.title) {
    setFieldValue("title", tab.title);
  }

  isLoadingTab.value = false;

  if (!pageUrl) return;

  duplicateBookmark.value = await findDuplicateBookmark(pageUrl);
  if (duplicateBookmark.value) return;

  const scraped = activeTabId ? await scrapeViaContentScript(activeTabId) : null;
  if (scraped && (scraped.title || scraped.description || scraped.faviconUrl)) {
    applyMetadata(scraped);
    return;
  }

  const fetched = await fetchMetadata(pageUrl);
  if (fetched) {
    applyMetadata(fetched);
  }
});

const onSubmit = handleSubmit(async (values) => {
  errorMessage.value = null;

  const existing = await findDuplicateBookmark(values.url);
  if (existing) {
    duplicateBookmark.value = existing;
    return;
  }

  const folderId =
    selectedFolderId.value !== UNCATEGORIZED_FOLDER_ID ? selectedFolderId.value : null;

  try {
    await addBookmarkMutation.mutateAsync({
      title: values.title,
      url: values.url,
      description: values.description,
      tags: values.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean),
      folder_id: folderId,
      favicon_url: fetchedFaviconUrl.value,
    });

    isSaved.value = true;
    setTimeout(() => window.close(), 900);
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : "Failed to add bookmark.";
  }
});
</script>

<template>
  <p v-if="isLoadingTab" class="text-neutral-500 dark:text-neutral-dark-100">
    Reading page…
  </p>

  <form v-else class="flex flex-col gap-250" @submit="onSubmit">
    <h2>Save bookmark</h2>

    <Input name="url" label="Page URL" type="text" disabled class="w-full" />

    <div
      v-if="duplicateBookmark"
      class="rounded-lg border border-amber-500/60 bg-amber-50 px-150 py-125 text-preset-4 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100"
    >
      This URL already exists as
      <span class="font-semibold">"{{ duplicateBookmark.title }}"</span>.
    </div>

    <Input name="title" label="Title" type="text" class="w-full" />
    <Textarea name="description" label="Description" class="w-full" />

    <label class="flex flex-col gap-1.5 text-small text-neutral-900 dark:text-neutral-dark-0">
      <span class="font-semibold">Folder</span>
      <select
        v-model="selectedFolderId"
        class="rounded-lg border py-2.5 px-4 font-medium bg-neutral-0 border-neutral-400 outline-none transition-colors focus:border-teal-700 dark:bg-neutral-dark-800 dark:border-neutral-dark-500 dark:text-neutral-dark-0 dark:focus:border-neutral-dark-300"
      >
        <option :value="UNCATEGORIZED_FOLDER_ID">Uncategorized</option>
        <option v-for="folder in folders" :key="folder.id" :value="folder.id">
          {{ folder.name }}
        </option>
      </select>
    </label>

    <Input name="tags" label="Tags (comma separated)" type="text" class="w-full" />

    <div
      v-if="errorMessage"
      class="rounded-lg border border-red-600/40 bg-red-50 px-150 py-125 text-preset-4 text-red-800 dark:bg-red-950/40 dark:text-red-200"
    >
      {{ errorMessage }}
    </div>
    <div
      v-if="isSaved"
      class="rounded-lg border border-green-600/40 bg-green-50 px-150 py-125 text-preset-4 text-green-800 dark:bg-green-950/40 dark:text-green-200"
    >
      Saved!
    </div>

    <Button
      type="submit"
      :loading="addBookmarkMutation.isPending.value"
      :disabled="!!duplicateBookmark || isSaved"
      class="w-full justify-center"
    >
      Save bookmark
    </Button>
  </form>
</template>
