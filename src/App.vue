<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import Toaster from "@/components/ui/Toaster.vue";

// A dynamic import (rather than a static one gated by v-if) so bundlers can
// statically eliminate this branch -- and the whole devtools package with it
// -- from the production build, since import.meta.env.DEV is known false
// at build time.
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
