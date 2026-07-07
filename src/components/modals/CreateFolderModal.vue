<script setup lang="ts">
import { ref } from "vue";
import Input from "@/components/ui/Input.vue";
import Modal from "@/components/ui/Modal.vue";
import Button from "@/components/ui/Button.vue";
import { useToast } from "@/composables/useToast";
import { useForm } from "vee-validate";
import { requiredRule } from "@/schemas/bookmark.schemas.ts";
import { useFolders } from "@/services/useFolder";

const isOpen = defineModel<boolean>();
const toast = useToast();
const { createFolder } = useFolders();
const loading = ref(false);

const { handleSubmit, resetForm } = useForm({
  validationSchema: {
    name: requiredRule("Folder name"),
  },
});

function handleClose() {
  isOpen.value = false;
  resetForm();
}

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const folder = await createFolder({ name: values.name });
  loading.value = false;

  if (!folder) {
    toast.error("Failed to create folder.");
    return;
  }

  isOpen.value = false;
  resetForm();
  toast.success(`Folder "${folder.name}" created.`);
});
</script>

<template>
  <Modal v-model="isOpen">
    <template #title>
      <h1>New Folder</h1>
    </template>

    <template #description>
      <p>Create a folder to organize your bookmarks.</p>
    </template>

    <template #main>
      <form class="flex flex-col gap-250" @submit="onSubmit">
        <Input name="name" label="Folder name" type="text" class="w-full" />

        <div class="mt-400 flex items-center justify-end gap-200">
          <Button variant="secondary" type="button" @click="handleClose">
            Cancel
          </Button>
          <Button type="submit" :loading="loading">Create Folder</Button>
        </div>
      </form>
    </template>
  </Modal>
</template>
