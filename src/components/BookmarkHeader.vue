<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Button from "./ui/Button.vue";
</script>

<template>
  <div class="flex items-center justify-between">
    <h1>All Bookmarks</h1>

    <Button variant="secondary"><Icon icon="local:icon-sort" />Sort by</Button>
  </div>
</template>
