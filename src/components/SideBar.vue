<!-- Sidebar.vue -->
<script setup lang="ts">
import Tags from "./ui/Tags.vue";
import { Icon } from "@iconify/vue";
import Button from "./ui/Button.vue";

defineProps<{
  isOpen?: boolean; // only used on tablet/mobile
}>();

const emit = defineEmits<{
  close: [];
}>();
</script>

<template>
  <!-- Overlay (tablet/mobile only) -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/40 z-20 lg:hidden"
      @click="emit('close')"
    />
  </Transition>

  <!-- Sidebar -->
  <Transition name="slide">
    <div
      :class="[
        'fixed lg:static top-0 left-0 z-30',
        'flex flex-col gap-200 bg-neutral-0 w-[296px] h-screen border-r border-neutral-400',
        'transition-transform duration-300',
        // On mobile/tablet: slide in/out. On lg: always visible
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <div class="relative pt-250 px-250 pb-125">
        <!-- Close button: tablet/mobile only -->
        <Button
          variant="secondary"
          size="none"
          class="absolute top-3 right-200 border-none lg:hidden"
          @click="emit('close')"
        >
          <Icon icon="local:icon-close" class="w-5 h-5" />
        </Button>

        <img src="/logo-light-theme.svg" alt="logo bookmark" />
      </div>

      <div class="flex flex-col gap-200 pt-0 pb-250 px-200">
        <div>
          <h1>Home</h1>
          <h1>Archived</h1>
        </div>
        <Tags />
      </div>
    </div>
  </Transition>
</template>
