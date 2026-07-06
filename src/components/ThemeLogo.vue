<script setup lang="ts">
const props = defineProps<{
  class?: string;
}>();
</script>

<template>
  <img
    src="/logo-light-theme.svg"
    alt="logo bookmark"
    :class="[props.class, 'dark:hidden']"
  />
  <img
    src="/logo-dark-theme.svg"
    alt="logo bookmark"
    :class="[props.class, 'hidden dark:block']"
  />
</template>
