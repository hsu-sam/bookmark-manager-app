<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "@/components/ui/Button.vue";
import PageNotFound from "@/components/illustrations/PageNotFound.vue";

const router = useRouter();

function goHome() {
  router.replace({ name: "user.index" });
}
</script>

<template>
  <div
    class="flex flex-1 flex-col items-center justify-center w-full min-h-screen px-200 py-300 text-center sm:px-400 sm:py-400"
  >
    <PageNotFound
      class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl"
    />

    <div
      class="flex flex-col items-center justify-center gap-200 sm:gap-250 w-full max-w-md sm:max-w-lg mt-250 sm:mt-300"
    >
      <h5 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-teal-800!">
        Page not found
      </h5>
      <p class="text-preset-4 sm:text-preset-3 text-neutral-600">
        We are sorry, the page requested could not be found. Please go back to
        the homepage.
      </p>
      <Button @click="goHome">Return Home</Button>
    </div>
  </div>
</template>
