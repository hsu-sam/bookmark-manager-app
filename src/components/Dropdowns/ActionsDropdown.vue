<script setup lang="ts">
import { computed } from "vue";
import Button from "../ui/Button.vue";
import { Icon } from "@iconify/vue";
import Dropdown from "../ui/Dropdown.vue";
import type { Bookmark } from "@/types/bookmark.ts";
import { useToast } from "@/composables/useToast.ts";
import { useBookmarks } from "@/composables/useBookmark.ts";

const toast = useToast();
const { recordVisit } = useBookmarks();

const props = withDefaults(
  defineProps<{
    bookmark: Bookmark;
    archived?: boolean;
  }>(),
  {
    archived: false,
  },
);

const emit = defineEmits<{
  (e: "edit"): void;
  (e: "toggle-pin", id: string): void;
  (e: "archive", id: string): void;
  (e: "unarchive", id: string): void;
}>();

const handleVisit = () => {
  window.open(props.bookmark.url, "_blank", "noopener,noreferrer");
  recordVisit(props.bookmark.id);
};

const handleCopy = async () => {
  await navigator.clipboard.writeText(props.bookmark.url);
  toast.success("URL copied to clipboard!");
};

const bookmarkActions = computed(() => {
  const actions = [
    {
      label: "Visit",
      icon: "lucide:external-link",
      action: handleVisit,
    },
    {
      label: "Copy URL",
      icon: "lucide:copy",
      action: handleCopy,
    },
    {
      label: props.bookmark.is_pinned ? "Unpin" : "Pin",
      icon: "lucide:pin",
      action: () => emit("toggle-pin", props.bookmark.id),
    },
    {
      label: "Edit",
      icon: "lucide:pencil",
      action: () => emit("edit"),
    },
  ];

  if (props.archived) {
    actions.push({
      label: "Unarchive",
      icon: "lucide:archive-restore",
      action: () => emit("unarchive", props.bookmark.id),
    });
  } else {
    actions.push({
      label: "Archive",
      icon: "lucide:archive",
      action: () => emit("archive", props.bookmark.id),
    });
  }

  return actions;
});
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
