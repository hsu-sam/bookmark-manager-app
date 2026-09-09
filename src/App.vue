<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import Toaster from "@/components/ui/Toaster.vue";

const isDev = import.meta.env.DEV;
const VueQueryDevtools = isDev
  ? defineAsyncComponent(() =>
      import("@tanstack/vue-query-devtools").then((m) => m.VueQueryDevtools),
    )
  : null;
</script>

<template>
  <router-view />
  <Toaster />
  <component :is="VueQueryDevtools" v-if="VueQueryDevtools" />
</template>
