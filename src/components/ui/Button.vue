<script setup lang="ts">
import { Icon } from "@iconify/vue";

type ButtonVariant = "default" | "secondary" | "danger" | "outline";

type ButtonSize = "none" | "sm" | "md";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

withDefaults(defineProps<ButtonProps>(), {
  variant: "default",
  size: "sm",
  type: "submit",
  disabled: false,
});

const variants: Record<ButtonVariant, string> = {
  default:
    "flex items-center gap-050 text-p4 leading-p4 font-medium text-neutral-0 bg-teal-700 hover:bg-teal-800 focus:outline-2 focus:outline-offset-2 focus:outline-teal-800 rounded-8 inset-shadow-sm inset-shadow-neutral-dark-300/80 cursor-pointer",
  secondary:
    "flex items-center gap-050 text-p4 leading-p4 font-medium text-neutral-900 bg-neutral-0 hover:bg-neutral-100 focus:outline-2 focus:outline-offset-2 focus:outline-teal-800 rounded-8 border border-neutral-400 cursor-pointer dark:text-neutral-dark-0 dark:bg-neutral-dark-800 dark:hover:bg-neutral-dark-600 dark:border-neutral-dark-500",

  danger:
    "flex items-center gap-050 text-p4 leading-p4 font-medium text-neutral-0 bg-red-500 hover:bg-red-800 focus:outline-2 focus:outline-offset-2 focus:outline-red-800 rounded-8 inset-shadow-sm inset-shadow-red--800 cursor-pointer",

  outline:
    "flex items-center gap-050 text-p4 leading-p4 font-medium text-teal-700 bg-transparent hover:bg-teal-100 focus:outline-2 focus:outline-offset-2 focus:outline-teal-800 rounded-8 cursor-pointer",
};

const sizes: Record<ButtonSize, string> = {
  none: "p-0",
  sm: "px-150 py-125",
  md: "px-200 py-150",
};
</script>

<template>
  <button
    :type
    :disabled="disabled || loading"
    :class="[variants[variant], sizes[size]]"
    class="transition-transform duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.97]"
  >
    <Icon icon="mdi-light:loading" class="animate-spin" v-if="loading" />
    <Icon v-else-if="icon" :icon />

    <slot />
  </button>
</template>
