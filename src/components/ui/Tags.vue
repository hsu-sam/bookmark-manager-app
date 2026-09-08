<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";
import SidebarSection from "./SidebarSection.vue";
import { supabase } from "@/utils/supabase";
import { bookmarksVersion } from "@/services/useBookmark";
import { useBookmarkTags } from "@/composables/useBookmarkTags";

const emit = defineEmits<{
  select: [];
}>();

const route = useRoute();
const { selectedTags, toggleTag, clearTags } = useBookmarkTags();

const tagsWithCounts = ref<{ name: string; count: number }[]>([]);

async function fetchTagCounts() {
  const isArchived = route.name === "user.archived";
  const { data, error } = await supabase.rpc("bookmark_tag_counts", {
    p_is_archived: isArchived,
  });

  if (error || !data) return;

  tagsWithCounts.value = (data as { tag: string; count: number }[]).map(
    (row) => ({ name: row.tag, count: row.count }),
  );
}

watch([() => route.name, bookmarksVersion], fetchTagCounts, {
  immediate: true,
});

function handleTagClick(tag: string) {
  toggleTag(tag);
  emit("select");
}

function handleReset() {
  clearTags();
  emit("select");
}
</script>

<template>
  <SidebarSection title="Tags" :default-open="false">
    <template #actions>
      <button
        v-if="selectedTags.length"
        type="button"
        class="px-100 text-preset-5 font-semibold text-neutral-800 hover:text-neutral-900 dark:text-neutral-dark-100 dark:hover:text-neutral-dark-0"
        @click.stop="handleReset"
      >
        Reset
      </button>
    </template>

    <div v-if="tagsWithCounts.length" class="flex flex-col gap-050">
      <button
        v-for="tag in tagsWithCounts"
        :key="tag.name"
        type="button"
        class="flex w-full min-w-0 items-center gap-100 rounded-8 bg-neutral-0 px-150 py-100 text-left transition-colors hover:bg-neutral-100 dark:border-neutral-dark-500 dark:bg-neutral-dark-800 dark:hover:bg-neutral-dark-600"
        @click="handleTagClick(tag.name)"
      >
        <span
          class="flex size-4 shrink-0 items-center justify-center rounded-4 border border-neutral-400 dark:border-neutral-dark-500"
          :class="
            selectedTags.includes(tag.name)
              ? 'border-teal-700 bg-teal-700 dark:border-teal-700 dark:bg-teal-700'
              : 'bg-neutral-0 dark:bg-neutral-dark-800'
          "
        >
          <Icon
            v-if="selectedTags.includes(tag.name)"
            icon="local:icon-check"
            class="size-3 text-neutral-0"
          />
        </span>

        <span
          class="min-w-0 flex-1 truncate text-preset-4 font-medium text-neutral-800 dark:text-neutral-dark-100"
        >
          {{ tag.name }}
        </span>

        <span
          class="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-preset-5 font-semibold text-neutral-800 dark:bg-neutral-dark-600 dark:text-neutral-dark-0"
        >
          {{ tag.count }}
        </span>
      </button>
    </div>

    <p
      v-else
      class="px-150 text-preset-4 text-neutral-500 dark:text-neutral-dark-100"
    >
      No tags yet
    </p>
  </SidebarSection>
</template>
