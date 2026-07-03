<script setup lang="ts">
import { ref, watch } from "vue";
import Input from "@/components/ui/Input.vue";
import Modal from "../ui/Modal.vue";
import Textarea from "@/components/ui/Textarea.vue";
import Button from "../ui/Button.vue";
import { useBookmarks } from "@/composables/useBookmark.ts";
import type { Bookmark } from "@/types/bookmark.ts";
import { useToast } from "@/composables/useToast";

const isOpen = defineModel<boolean>();
const toast = useToast();

const props = defineProps<{
  bookmark: Bookmark;
}>();

const emit = defineEmits<{
  updated: [];
}>();

const { updateBookmark } = useBookmarks();

const form = ref({
  title: "",
  description: "",
  url: "",
  tags: "",
});

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
  },
  { immediate: true },
);

const handleUpdate = async () => {
  if (!props.bookmark) return;

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

  if (!result) return;

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

          <Button type="submit"> Save Bookmark </Button>
        </div>
      </form>
    </template>
  </Modal>
</template>
