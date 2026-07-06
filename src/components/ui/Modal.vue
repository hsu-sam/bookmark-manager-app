<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "radix-vue";
import { Icon } from "@iconify/vue";
import Button from "./Button.vue";

interface ModalProps {
  title?: string;
  description?: string;
  hideDefaultClose?: boolean;
  contentClass?: string;
  width?: string;
}

defineProps<ModalProps>();

const isOpen = defineModel<boolean>();
</script>

<template>
  <DialogRoot v-model:open="isOpen">
    <DialogTrigger v-if="$slots.trigger" as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay
        style="
          position: fixed;
          inset: 0;
          z-index: 50;
          background-color: rgb(10 10 10 / 0.6);
        "
      />

      <DialogContent
        class="flex flex-col gap-400 fixed left-1/2 top-1/2 z-100 -translate-x-1/2 -translate-y-1/2 rounded-16 p-400 bg-neutral-0 dark:bg-neutral-dark-800 data-[state=open]:animate-contentShow"
        :class="[contentClass, width || 'w-[90vw] max-w-[500px]']"
      >
        <!-- Close button -->
        <DialogClose
          v-if="!hideDefaultClose"
          class="absolute right-4 top-4"
          aria-label="Close"
        >
          <Button variant="secondary">
            <Icon icon="local:icon-close" class="h-5 w-5"
          /></Button>
        </DialogClose>

        <!-- Header -->
        <div
          v-if="$slots.title || $slots.description"
          class="flex flex-col gap-100"
        >
          <DialogTitle as-child>
            <slot name="title" />
          </DialogTitle>
          <DialogDescription as-child>
            <slot name="description" />
          </DialogDescription>
        </div>

        <!-- Main content -->
        <div class="flex flex-col gap-250">
          <slot name="main" />
        </div>

        <!-- Footer -->
        <div v-if="$slots.footer" class="flex items-center justify-end gap-200">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
