<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import Dropdown from "../ui/Dropdown.vue";
import { useAuth } from "@/composables/useAuth";
import { useTheme } from "@/composables/useTheme";

const router = useRouter();
const { user } = useAuth();
const { theme, setTheme } = useTheme();

const fullName = computed(() => {
  const metadata = user.value?.user_metadata?.full_name;
  if (typeof metadata === "string" && metadata.trim()) return metadata.trim();
  return "User";
});

const email = computed(() => user.value?.email ?? "");

function logout() {
  router.push({ name: "auth.logout" });
}
</script>

<template>
  <Dropdown align="end">
    <template #trigger>
      <button
        type="button"
        class="flex items-center justify-center rounded-full border border-neutral-300 p-2 hover:bg-neutral-100 dark:border-neutral-dark-500 dark:hover:bg-neutral-dark-600"
      >
        <Icon
          icon="local:icon-person"
          class="w-5 h-5 text-neutral-800 dark:text-neutral-dark-100"
        />
      </button>
    </template>

    <template #content>
      <!-- Profile header -->
      <div class="min-w-62 flex items-center gap-150 py-150 px-100">
        <div
          class="w-500 h-500 rounded-full border border-neutral-300 p-2 hover:bg-neutral-100 dark:border-neutral-dark-500 dark:hover:bg-neutral-dark-600"
        >
          <Icon
            icon="local:icon-person"
            class="w-5 h-5 text-neutral-800 dark:text-neutral-dark-100"
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

      <div class="h-px bg-neutral-100 mx-1 my-1 dark:bg-neutral-dark-500" />

      <!-- Logout -->
      <button
        @click="logout"
        type="button"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-800 cursor-pointer outline-none text-left hover:bg-neutral-100 dark:text-neutral-dark-100 dark:hover:bg-neutral-dark-600"
      >
        <Icon icon="local:icon-logout" class="w-4 h-4" />
        Logout
      </button>
    </template>
  </Dropdown>
</template>
