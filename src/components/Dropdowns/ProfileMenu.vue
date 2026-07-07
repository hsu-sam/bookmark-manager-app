<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import Dropdown from "../ui/Dropdown.vue";
import AvatarPickerModal from "../modals/AvatarPickerModal.vue";
import { useAuth } from "@/services/useAuth.ts";
import { useTheme } from "@/composables/useTheme";

const router = useRouter();
const { user } = useAuth();
const { theme, setTheme } = useTheme();
const isAvatarModalOpen = ref(false);

const fullName = computed(() => {
  const metadata = user.value?.user_metadata?.full_name;
  if (typeof metadata === "string" && metadata.trim()) return metadata.trim();
  return "User";
});

const email = computed(() => user.value?.email ?? "");

const avatarUrl = computed(() => {
  const metadata = user.value?.user_metadata?.avatar_url;
  return typeof metadata === "string" && metadata.trim() ? metadata.trim() : "";
});

function logout() {
  router.push({ name: "auth.logout" });
}
</script>

<template>
  <Dropdown align="end">
    <template #trigger>
      <button
        type="button"
        class="flex items-center justify-center overflow-hidden rounded-full border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-dark-500 dark:hover:bg-neutral-dark-600"
        :class="avatarUrl ? 'p-0' : 'p-2'"
      >
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="`${fullName} avatar`"
          class="size-10 rounded-full object-cover"
        />
        <Icon
          v-else
          icon="local:icon-person"
          class="h-5 w-5 text-neutral-800 dark:text-neutral-dark-100"
        />
      </button>
    </template>

    <template #content>
      <!-- Profile header -->
      <div class="flex min-w-62 items-center gap-150 px-100 py-150">
        <div
          class="flex size-500 shrink-0 items-center justify-center overflow-hidden rounded-full border border-neutral-300 p-2 dark:border-neutral-dark-500"
        >
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="`${fullName} avatar`"
            class="size-8 rounded-full object-cover"
          />
          <Icon
            v-else
            icon="local:icon-person"
            class="h-5 w-5 text-neutral-800 dark:text-neutral-dark-100"
          />
        </div>
        <div>
          <p
            class="text-preset-4 font-bold text-neutral-900 dark:text-neutral-dark-0"
          >
            {{ fullName }}
          </p>
          <p class="text-preset-4 text-neutral-800 dark:text-neutral-dark-100">
            {{ email }}
          </p>
        </div>
      </div>

      <!-- Theme toggle -->
      <div class="flex items-center justify-between p-100">
        <div
          class="flex items-center gap-125 text-preset-4 text-neutral-800 dark:text-neutral-dark-100"
        >
          <Icon icon="local:icon-theme" class="w-4 h-4" />
          Theme
        </div>
        <div
          class="flex items-center border border-neutral-300 bg-neutral-300 rounded-4 overflow-hidden p-025 dark:border-neutral-dark-500 dark:bg-neutral-dark-600"
        >
          <button
            class="px-2.5 py-1.5 rounded-4 transition-colors text-neutral-900 dark:text-neutral-dark-0"
            :class="
              theme === 'light'
                ? 'bg-neutral-0 hover:bg-neutral-100 dark:bg-neutral-dark-800 dark:hover:bg-neutral-dark-600'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-dark-500'
            "
            type="button"
            @click="setTheme('light')"
          >
            <Icon icon="local:icon-light-theme" class="w-4 h-4" />
          </button>
          <button
            class="px-2.5 py-1.5 rounded-4 transition-colors text-neutral-900 dark:text-neutral-dark-0"
            :class="
              theme === 'dark'
                ? 'bg-neutral-0 hover:bg-neutral-100 dark:bg-neutral-dark-800 dark:hover:bg-neutral-dark-600'
                : 'hover:bg-neutral-100 dark:hover:bg-neutral-dark-500'
            "
            type="button"
            @click="setTheme('dark')"
          >
            <Icon icon="local:icon-dark-theme" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="mx-1 my-1 h-px bg-neutral-100 dark:bg-neutral-dark-500" />

      <button
        type="button"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-neutral-800 outline-none hover:bg-neutral-100 dark:text-neutral-dark-100 dark:hover:bg-neutral-dark-600"
        @click="isAvatarModalOpen = true"
      >
        <Icon icon="local:icon-person" class="h-4 w-4" />
        Change avatar
      </button>

      <div class="mx-1 my-1 h-px bg-neutral-100 dark:bg-neutral-dark-500" />

      <!-- Logout -->
      <button
        type="button"
        class="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-neutral-800 outline-none hover:bg-neutral-100 dark:text-neutral-dark-100 dark:hover:bg-neutral-dark-600"
        @click="logout"
      >
        <Icon icon="local:icon-logout" class="h-4 w-4" />
        Logout
      </button>
    </template>
  </Dropdown>

  <AvatarPickerModal v-model="isAvatarModalOpen" />
</template>
