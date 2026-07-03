<script setup lang="ts">
import { useRouter } from "vue-router";

import { Icon } from "@iconify/vue";
import Dropdown from "../ui/Dropdown.vue";

const router = useRouter();

function logout() {
  router.push({ name: "auth.logout" });
}
</script>

<template>
  <Dropdown align="end">
    <template #trigger>
      <button
        type="button"
        class="flex items-center justify-center rounded-full border border-neutral-300 p-2 hover:bg-neutral-100"
      >
        <Icon icon="lucide:user" class="w-5 h-5 text-neutral-800" />
      </button>
    </template>

    <template #content>
      <!-- Profile header -->
      <div class="min-w-62 flex items-center gap-150 py-150 px-100">
        <div
          class="w-[40px] h-[40px] rounded-full border border-neutral-300 p-2 hover:bg-neutral-100"
        >
          <Icon icon="lucide:user" class="w-5 h-5" />
        </div>
        <div>
          <p class="text-preset-4 font-bold text-neutral-900">Samuel</p>
          <p class="text-preset-4 text-neutral-800">segunhounsou@gmail.com</p>
        </div>
      </div>

      <!-- Theme toggle -->
      <div class="flex items-center justify-between p-100">
        <div class="flex items-center gap-125 text-preset-4 text-neutral-800">
          <Icon icon="lucide:palette" class="w-4 h-4" />
          Theme
        </div>
        <div
          class="flex items-center border border-neutral-300 bg-neutral-300 rounded-4 overflow-hidden p-025"
        >
          <button
            class="px-2.5 py-1.5 bg-neutral-0 hover:bg-neutral-100 rounded-4 transition-colors"
            type="button"
          >
            <Icon icon="lucide:sun" class="w-4 h-4" />
          </button>
          <button
            class="px-2.5 py-1.5 hover:bg-neutral-100 rounded-4 transition-colors"
            type="button"
          >
            <Icon icon="lucide:moon" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="h-px bg-neutral-100 mx-1 my-1" />

      <!-- Logout -->
      <button
        @click="logout"
        type="button"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-800 cursor-pointer outline-none text-left hover:bg-neutral-100"
      >
        <Icon icon="lucide:log-out" class="w-4 h-4" />
        Logout
      </button>
    </template>
  </Dropdown>
</template>
