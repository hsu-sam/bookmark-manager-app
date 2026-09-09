<script setup lang="ts">
import { onMounted } from "vue";
import { useAuth } from "@/services/useAuth";
import ThemeLogo from "@/components/ThemeLogo.vue";
import LoginView from "./LoginView.vue";
import QuickAddView from "./QuickAddView.vue";

const { isReady, isAuthenticated, initAuth } = useAuth();

onMounted(() => {
  initAuth();
});
</script>

<template>
  <main class="flex flex-col gap-300 p-300 bg-neutral-0 dark:bg-neutral-dark-800">
    <ThemeLogo class="h-6 w-auto" />

    <p
      v-if="!isReady"
      class="text-preset-4 text-neutral-500 dark:text-neutral-dark-100"
    >
      Loading…
    </p>
    <LoginView v-else-if="!isAuthenticated" />
    <QuickAddView v-else />
  </main>
</template>
