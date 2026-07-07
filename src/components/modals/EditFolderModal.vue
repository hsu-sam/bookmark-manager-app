<script setup lang="ts">
import { ref, watch } from "vue";
import Input from "@/components/ui/Input.vue";
import Modal from "@/components/ui/Modal.vue";
import Button from "@/components/ui/Button.vue";
import { useToast } from "@/composables/useToast";
import { useForm } from "vee-validate";
import { requiredRule } from "@/schemas/bookmark.schemas.ts";
import { useFolders } from "@/services/useFolder";
import type { Folder } from "@/types/folder";

const isOpen = defineModel<boolean>();

const props = defineProps<{
  folder: Folder;
}>();

const toast = useToast();
const { updateFolder } = useFolders();
const loading = ref(false);

const { handleSubmit, setFieldValue, resetForm } = useForm({
  validationSchema: {
    name: requiredRule("Folder name"),
  },
});

watch(isOpen, (open) => {
  if (open) {
    setFieldValue("name", props.folder.name);
    return;
  }

  resetForm();
});

function handleClose() {
  isOpen.value = false;
}

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const folder = await updateFolder(props.folder.id, {
    name: values.name.trim(),
  });
  loading.value = false;

  if (!folder) {
    toast.error("Failed to rename folder.");
    return;
  }

  isOpen.value = false;
  resetForm();
  toast.success(`Folder renamed to "${folder.name}".`);
});
</script>

<template>
  <Modal v-model="isOpen">
    <template #title>
      <h1>Rename Folder</h1>
    </template>

    <template #description>
      <p>Update the name of "{{ folder.name }}".</p>
    </template>

    <template #main>
      <form class="flex flex-col gap-250" @submit="onSubmit">
        <Input name="name" label="Folder name" type="text" class="w-full" />

        <div class="mt-400 flex items-center justify-end gap-200">
          <Button variant="secondary" type="button" @click="handleClose">
            Cancel
          </Button>
          <Button type="submit" :loading="loading">Save</Button>
        </div>
      </form>
    </template>
  </Modal>
</template>
