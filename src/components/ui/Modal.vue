<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogDescription,
} from "@headlessui/vue";
import { Icon } from "@iconify/vue";

interface ModalProps {
  title?: string;
  description?: string;
  dialogClass?: string;
  hideDefaultClose?: boolean;
  width?: string;
}

defineProps<ModalProps>();
const emit = defineEmits(["close"]);

const isOpen = defineModel<boolean>();

function close() {
  isOpen.value = false;
  emit("close");
}
</script>

<template>
  <Dialog :open="isOpen" v-if="isOpen" @close="close" class="relative z-50">
    <div class="fixed inset-0 bg-black/60" aria-hidden="true" />

    <div class="fixed inset-0 flex items-center justify-center p-4 mx-auto">
      <DialogPanel
        class="flex flex-col gap-4 rounded-4xl border"
        :class="[
          dialogClass || 'bg-white p-8 border-border',
          width ? `w-${width}` : 'w-125',
        ]"
      >
        <Icon
          v-if="!hideDefaultClose"
          icon="local:icon-close"
          :width="32"
          :height="32"
          @click="close"
          class="self-end cursor-pointer"
        />

        <div
          v-if="$slots.title || $slots.description"
          class="flex flex-col gap-1.5"
        >
          <DialogTitle class="text-h2 leading-h2 text-dark-gray font-bold">
            <slot name="title" />
          </DialogTitle>

          <DialogDescription
            class="text-p2 leading-p2 text-secondary-gray font-medium"
          >
            <slot name="description" />
          </DialogDescription>
        </div>

        <slot name="main" :close />

        <div
          v-if="$slots.footer"
          class="flex justify-center items-center gap-3 text-small w-full mt-2"
        >
          <slot name="footer" />
        </div>
      </DialogPanel>
    </div>
  </Dialog>
</template>
