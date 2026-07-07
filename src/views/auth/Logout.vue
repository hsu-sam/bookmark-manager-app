<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/services/useAuth";

const router = useRouter();
const { signOut } = useAuth();

onMounted(async () => {
  await signOut();
  router.replace({ name: "auth.signin" });
});
</script>

<template></template>
