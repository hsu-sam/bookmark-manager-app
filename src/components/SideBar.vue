<!-- Sidebar.vue -->
<script setup lang="ts">
import Tags from "./ui/Tags.vue";
import { Icon } from "@iconify/vue";
import Button from "./ui/Button.vue";
import ThemeLogo from "./ThemeLogo.vue";
import { useRoute } from "vue-router";

interface Section {
  label: string;
  name: string;
  path: string;
  icon: string;
}

const props = defineProps<{
  isOpen?: boolean; // only used on tablet/mobile
}>();

const emit = defineEmits<{
  close: [];
}>();

function closeSidebar() {
  emit("close");
}

const sections: Section[] = [
  {
    label: "Home",
    name: "user.index",
    path: "/home",
    icon: "local:icon-home",
  },
  {
    label: "Archived",
    name: "user.archived",
    path: "/archived",
    icon: "local:icon-archive",
  },
];

const isRouteActive = (routeName: string) => {
  return routeName === useRoute().name;
};
</script>

<template>
  <!-- Backdrop (tablet/mobile only) -->
  <Teleport to="body">
    <Transition name="sidebar-backdrop">
      <div
        v-if="props.isOpen"
        class="fixed inset-0 z-40 h-screen w-screen bg-black/40 lg:hidden"
        aria-hidden="true"
        @click="closeSidebar"
      />
    </Transition>
  </Teleport>

  <!-- Sidebar -->
  <div
    :class="[
      'fixed lg:static top-0 left-0 z-50',
      'flex flex-col gap-200 bg-neutral-0 w-74 h-screen border-r border-neutral-400 dark:bg-neutral-dark-800 dark:border-r-neutral-dark-500',
      'transition-transform duration-300',
      // On mobile/tablet: slide in/out. On lg: always visible
      'lg:translate-x-0',
      props.isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
      <div class="relative pt-250 px-250 pb-125">
        <!-- Close button: tablet/mobile only -->
        <Button
          variant="secondary"
          size="none"
          class="absolute top-3 right-200 border-none lg:hidden"
          @click="closeSidebar"
        >
          <Icon icon="local:icon-close" class="w-5 h-5" />
        </Button>

        <ThemeLogo />
      </div>

      <div class="flex flex-col gap-200 pt-0 pb-250 px-200">
        <div>
          <router-link
            v-for="section in sections"
            :key="section.name"
            :to="{ name: section.name.toLowerCase() }"
            :class="{
              'active group': isRouteActive(section.name),
            }"
            @click="closeSidebar"
          >
            <div
              class="flex items-center gap-100 py-100 px-150 rounded-8 mb-0.5 text-neutral-800 hover:bg-neutral-100 transition-colors group-[.active]:bg-neutral-100 group-[.active]:text-neutral-900 dark:text-neutral-dark-100 dark:hover:bg-neutral-dark-600 dark:group-[.active]:bg-neutral-dark-600 dark:group-[.active]:text-neutral-dark-0"
            >
              <Icon :icon="section.icon" class="w-5 h-5" />
              <span class="text-preset-3 font-semibold">
                {{ section.label }}
              </span>
            </div>
          </router-link>
        </div>
        <Tags @select="closeSidebar" />
      </div>
    </div>
</template>

<style scoped>
.sidebar-backdrop-enter-active,
.sidebar-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.sidebar-backdrop-enter-from,
.sidebar-backdrop-leave-to {
  opacity: 0;
}
</style>
