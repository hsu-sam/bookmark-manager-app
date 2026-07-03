<script setup lang="ts">
import { ref } from "vue";
import Input from "@/components/ui/Input.vue";
import Modal from "../ui/Modal.vue";
import Textarea from "@/components/ui/Textarea.vue";
import Button from "../ui/Button.vue";
import { useToast } from "@/composables/useToast";
import { requiredRule } from "@/schemas/bookmark.schemas.ts";
import { useForm } from "vee-validate";
import { useBookmarks } from "@/composables/useBookmark.ts";

const toast = useToast();
const { addBookmark } = useBookmarks();

const isOpen = defineModel<boolean>();
const loading = ref(false);

const { handleSubmit } = useForm({
  validationSchema: {
    title: requiredRule("Title"),
    url: requiredRule("Website URL"),
    description: requiredRule("Description"),
    tags: requiredRule("Tags"),
  },
});

const handleCloseModal = () => {
  isOpen.value = false;
};

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const bookmark = await addBookmark({
    title: values.title,
    url: values.url,
    description: values.description,
    tags: Array.isArray(values.tags)
      ? values.tags
      : values.tags
        ? [values.tags]
        : [],
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
    <template #description
      ><p>
        Save a link with details to keep your collection organized. We extract
        the favicon automatically from the Url
      </p></template
    >

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
        <Input name="tags" label="Tags" type="text" class="w-full" />

        <div class="flex items-center justify-end gap-200 mt-400">
          <Button variant="secondary" type="button" @click="handleCloseModal">
            Cancel
          </Button>
          <Button type="submit" :loading="loading"> Add Bookmark </Button>
        </div>
      </form>
    </template>
  </Modal>
</template>
