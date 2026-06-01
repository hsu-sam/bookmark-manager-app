<script setup lang="ts">
import AuthLayout from "./layouts/AuthLayout.vue";
import MainLayout from "./layouts/MainLayout.vue";
</script>

<template>
  <auth-layout v-if="$route.meta.layout === 'auth'">
    <router-view />
  </auth-layout>
</template>
