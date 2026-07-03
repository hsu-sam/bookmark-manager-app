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
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <PageNotFound />

    <div class="flex flex-col items-center justify-center gap-4">
      <h5 class="text-7xl text-teal-800!">Page not found</h5>
      <p>
        We are sorry, the page requested could not be found. Please go back to
        the homepage.
      </p>
      <Button @click="goHome">Return Home</Button>
    </div>
  </div>
</template>
