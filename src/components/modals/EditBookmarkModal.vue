<script setup lang="ts">
import Input from "@/components/ui/Input.vue";
import Modal from "../ui/Modal.vue";
import Textarea from "@/components/ui/Textarea.vue";
import Button from "../ui/Button.vue";

const isOpen = defineModel<boolean>();

function handleCloseModal() {}
</script>

<template>
  <Modal v-model="isOpen">
    <template #title><h1>Edit Bookmark</h1></template>
    <template #description
      ><p>
        Update your saved link details - change the title, description, URL, or
        tags anytime.
      </p></template
    >

    <template #main>
      <form action="" class="flex flex-col gap-250">
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
          <Button variant="secondary">Cancel</Button>
          <Button>Save Bookmark</Button>
        </div>
      </form>
    </template>
  </Modal>
</template>
