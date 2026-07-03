<script setup lang="ts">
import Toast from "@/components/ui/Toast.vue";
import { useToast } from "@/composables/useToast";

const { toasts, dismiss } = useToast();
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed top-200 right-200 z-50 flex flex-col gap-100 items-end"
    >
      <TransitionGroup name="toast">
        <Toast
          v-for="item in toasts"
          :key="item.id"
          :type="item.type"
          :message="item.message"
          @close="dismiss(item.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(16px);
}
</style>
