<script setup lang="ts">
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import Modal from "@/components/ui/Modal.vue";
import Button from "@/components/ui/Button.vue";
import {
  generateAvatars,
  type DicebearAvatar,
} from "@/composables/useDicebearAvatar";
import { useUpdateAvatar } from "@/composables/useUpdateAvatar";
import { useToast } from "@/composables/useToast";

const AVATAR_COUNT = 24;

const isOpen = defineModel<boolean>();

const emit = defineEmits<{
  updated: [payload: { imageUrl: string; message: string }];
  error: [message: string];
}>();

const toast = useToast();
const avatars = ref<DicebearAvatar[]>([]);
const selectedSeed = ref<string | null>(null);
const { updateAvatar, isLoading } = useUpdateAvatar();

function refresh() {
  avatars.value = generateAvatars(AVATAR_COUNT);
  selectedSeed.value = null;
}

watch(isOpen, (opened) => {
  if (opened) refresh();
});

async function handleConfirm() {
  const picked = avatars.value.find(
    (avatar) => avatar.seed === selectedSeed.value,
  );
  if (!picked) return;

  const response = await updateAvatar(picked.url);

  if (!response.success) {
    emit("error", response.message);
    toast.error(response.message);
    return;
  }

  emit("updated", { imageUrl: picked.url, message: response.message });
  toast.success(response.message);
  isOpen.value = false;
}

function handleClose() {
  isOpen.value = false;
}
</script>

<template>
  <Modal v-model="isOpen" width="w-[90vw] max-w-2xl">
    <template #title>
      <h1>Choose an avatar</h1>
    </template>

    <template #description>
      <p>Select an avatar that represents you.</p>
    </template>

    <template #main>
      <div class="flex justify-end">
        <button
          type="button"
          class="flex items-center gap-100 text-preset-4 font-medium text-neutral-800 transition-colors hover:text-neutral-900 disabled:opacity-50 dark:text-neutral-dark-100 dark:hover:text-neutral-dark-0"
          :disabled="isLoading"
          @click="refresh"
        >
          <Icon icon="lucide:refresh-cw" class="size-4" />
          Regenerate
        </button>
      </div>

      <div
        class="grid max-h-96 grid-cols-4 gap-150 overflow-y-auto p-025 sm:grid-cols-6"
      >
        <button
          v-for="avatar in avatars"
          :key="avatar.seed"
          type="button"
          class="aspect-square overflow-hidden rounded-full border-2 transition-all disabled:opacity-50"
          :class="
            selectedSeed === avatar.seed
              ? 'border-teal-700 dark:border-teal-700'
              : 'border-neutral-400 hover:border-neutral-500 dark:border-neutral-dark-500 dark:hover:border-neutral-dark-300'
          "
          :disabled="isLoading"
          @click="selectedSeed = avatar.seed"
        >
          <img
            :src="avatar.dataUri"
            :alt="`Avatar ${avatar.seed}`"
            class="h-full w-full bg-neutral-100 object-cover dark:bg-neutral-dark-600"
          />
        </button>
      </div>

      <div class="flex gap-200 justify-end">
        <Button
          variant="secondary"
          type="button"
          :disabled="isLoading"
          @click="handleClose"
        >
          Cancel
        </Button>
        <Button
          type="button"
          :disabled="!selectedSeed"
          :loading="isLoading"
          @click="handleConfirm"
        >
          Confirm
        </Button>
      </div>
    </template>
  </Modal>
</template>
