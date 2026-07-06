<script setup lang="ts">
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "radix-vue";
import { Icon } from "@iconify/vue";

export interface DropdownItem {
  label: string;
  icon?: string;
  danger?: boolean;
  separator?: boolean;
  action: () => void;
}

interface DropdownProps {
  items?: DropdownItem[];
  align?: "start" | "center" | "end";
  contentClass?: string;
}

withDefaults(defineProps<DropdownProps>(), {
  align: "end",
});
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :align
        :side-offset="8"
        class="z-50 min-w-[180px] rounded-xl border border-neutral-200 bg-white shadow-lg p-1 outline-none dark:border-neutral-dark-500 dark:bg-neutral-dark-800 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        :class="contentClass"
      >
        <!-- Custom content slot (for profile menu etc.) -->
        <slot name="content" />

        <!-- Simple items list -->
        <template v-if="items?.length">
          <template v-for="(item, i) in items" :key="i">
            <DropdownMenuSeparator
              v-if="item.separator"
              class="my-1 h-px bg-neutral-100 dark:bg-neutral-dark-500"
            />
            <DropdownMenuItem
              v-else
              @click="item.action"
              class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer outline-none select-none transition-colors"
              :class="
                item.danger
                  ? 'text-red-600 focus:bg-red-50 dark:focus:bg-neutral-dark-600'
                  : 'text-neutral-700 focus:bg-neutral-100 dark:text-neutral-dark-100 dark:focus:bg-neutral-dark-600'
              "
            >
              <Icon
                v-if="item.icon"
                :icon="item.icon"
                class="w-4 h-4 shrink-0"
              />
              {{ item.label }}
            </DropdownMenuItem>
          </template>
        </template>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
