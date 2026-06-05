<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Dropdown from "../ui/Dropdown.vue";
</script>

<template>
  <Dropdown align="end">
    <template #trigger>
      <button
        type="button"
        class="flex items-center justify-center rounded-full border border-neutral-300 p-2 hover:bg-neutral-100"
      >
        <Icon icon="lucide:user" class="w-5 h-5 text-neutral-700" />
      </button>
    </template>

    <template #content>
      <!-- Profile header -->
      <div
        class="flex items-center gap-3 px-3 py-3 border-b border-neutral-100 mb-1"
      >
        <div class="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
          <Icon icon="lucide:user" class="w-5 h-5" />
        </div>
        <div>
          <p class="text-sm font-semibold text-neutral-900">Samuel</p>
          <p class="text-xs text-neutral-500">segunhounsou</p>
        </div>
      </div>

      <!-- Theme toggle -->
      <div class="flex items-center justify-between px-3 py-2.5">
        <div
          class="flex items-center gap-3 text-sm font-medium text-neutral-700"
        >
          <Icon icon="lucide:palette" class="w-4 h-4" />
          Theme
        </div>
        <div
          class="flex items-center border border-neutral-200 rounded-lg overflow-hidden"
        >
          <button class="px-2.5 py-1.5 hover:bg-neutral-100 transition-colors" type="button">
            <Icon icon="lucide:sun" class="w-4 h-4" />
          </button>
          <button class="px-2.5 py-1.5 hover:bg-neutral-100 transition-colors" type="button">
            <Icon icon="lucide:moon" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="h-px bg-neutral-100 mx-1 my-1" />

      <!-- Logout -->
      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-700 cursor-pointer outline-none text-left hover:bg-neutral-100"
      >
        <Icon icon="lucide:log-out" class="w-4 h-4" />
        Logout
      </button>
    </template>
  </Dropdown>
</template>
