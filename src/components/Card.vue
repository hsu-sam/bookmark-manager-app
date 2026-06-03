<script setup lang="ts">
import { Icon } from "@iconify/vue";
import Button from "./ui/Button.vue";
</script>

<template>
  <div class="bg-neutral-0 rounded-12 max-w-84.5">
    <div class="flex flex-col items-center gap-200 p-200">
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-150">
          <div class="rounded-12 border border-neutral-300 bg-neutral-0">
            <img
              src="https://www.google.com/s2/favicons?sz=64&domain=google.com"
              alt="Google Favicon"
              class="w-11 h-11 rounded-8"
            />
          </div>
          <div class="flex flex-col items-center gap-050">
            <h2 class="text-h3 text-neutral-900">Google</h2>
            <p class="text-preset-5 text-neutral-600">google.com</p>
          </div>
        </div>

        <Button variant="secondary"
          ><Icon icon="local:icon-menu-bookmark"
        /></Button>
      </div>

      <div class="w-full border-b border-neutral-300"></div>

      <p class="text-p4 text-neutral-600">
        This is a sample bookmark description. You can add more details about
        the bookmark here.
      </p>

      <div class="flex flex-wrap items-center gap-150 w-full">
        <p class="px-100 py-025 bg-neutral-100 rounded-4">Search</p>
        <p class="px-100 py-025 bg-neutral-100 rounded-4">Google</p>
        <p class="px-100 py-025 bg-neutral-100 rounded-4">Browse</p>
        <p class="px-100 py-025 bg-neutral-100 rounded-4">Navigate</p>
      </div>
    </div>

    <div
      class="flex items-center justify-between px-200 py-150 border-t border-neutral-300"
    >
      <div class="flex items-center gap-200">
        <p class="flex items-center gap-100">
          <Icon icon="local:icon-visit-count" /> <span>47</span>
        </p>
        <p class="flex items-center gap-100">
          <Icon icon="local:icon-last-visited" /> <span>23 Sep</span>
        </p>
        <p class="flex items-center gap-100">
          <Icon icon="local:icon-created" /> <span>10 Jan </span>
        </p>
      </div>

      <Button variant="outline"><Icon icon="local:icon-pin" /></Button>
    </div>
  </div>
</template>
