<script setup lang="ts">
import Button from "../ui/Button.vue";
import { Icon } from "@iconify/vue";
import Dropdown from "../ui/Dropdown.vue";

const bookmarkActions = [
  {
    label: "Visit",
    icon: "lucide:external-link",
    action: () => console.log("Visit action clicked"),
  },
  {
    label: "Copy URL",
    icon: "lucide:copy",
    action: () => console.log("Copy URL action clicked"),
  },
  {
    label: "Unpin",
    icon: "lucide:pin-off",
    action: () => console.log("Unpin action clicked"),
  },
  {
    label: "Edit",
    icon: "lucide:pencil",
    action: () => console.log("Edit action clicked"),
  },
  {
    label: "Archive",
    icon: "lucide:archive",
    action: () => console.log("Archive action clicked"),
  },
];
</script>

<template>
  <Dropdown :items="bookmarkActions">
    <template #trigger>
      <Button variant="secondary"
        ><Icon icon="local:icon-menu-bookmark"
      /></Button>
    </template>
  </Dropdown>
</template>
