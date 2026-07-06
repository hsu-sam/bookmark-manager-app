<script setup lang="ts">
import { ErrorMessage, Field } from "vee-validate";
import { computed } from "vue";

export interface TextAreaProps {
  label?: string;
  name: string;
  disabled?: boolean;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  placeholder?: string;
}

const props = withDefaults(defineProps<TextAreaProps>(), {
  required: true,
  maxLength: 280,
  rows: 3,
});

const model = defineModel<string>();

const charCount = computed(() => model.value?.length ?? 0);
const isOverLimit = computed(() => charCount.value > props.maxLength);
</script>

<template>
  <Field
    validateOnChange
    :name
    v-model="model"
    v-slot="{ field, meta, errorMessage }"
  >
    <label
      :class="[
        'flex flex-col gap-1.5 has-disabled:opacity-40 text-small text-neutral-900 dark:text-neutral-dark-0',
        $attrs.class,
      ]"
    >
      <span class="font-semibold">
        {{ label }}
        <em class="text-teal-700 not-italic dark:text-neutral-dark-300" v-if="required">*</em>
      </span>

      <div
        class="flex flex-col border rounded-lg py-2.5 px-4 font-medium textarea-container bg-neutral-0 border-neutral-400 transition-colors focus-within:border-teal-700 dark:bg-neutral-dark-800 dark:border-neutral-dark-500 dark:focus-within:border-neutral-dark-300"
        :class="{
          'border-red-600 dark:border-red-600': (meta.touched && !meta.valid) || isOverLimit,
          'ring-1 ring-red-600': isOverLimit,
        }"
      >
        <textarea
          v-bind="{ ...field, ...$attrs }"
          :name
          :disabled
          :rows
          :placeholder
          v-model="model"
          class="flex-1 outline-none resize-y min-h-[80px] bg-transparent text-neutral-900 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-dark-0 dark:placeholder:text-neutral-dark-100/60"
        />
      </div>

      <div class="flex items-center justify-between">
        <div class="flex-1">
          <slot v-if="!errorMessage" name="helper" class="font-medium" />
          <ErrorMessage :name class="font-medium text-red-600" />
        </div>
        <span
          class="text-xs font-medium tabular-nums shrink-0"
          :class="
            isOverLimit
              ? 'text-red-600'
              : charCount >= maxLength * 0.9
                ? 'text-amber-500'
                : 'text-neutral-500 dark:text-neutral-dark-100'
          "
        >
          {{ charCount }}/{{ maxLength }}
        </span>
      </div>
    </label>
  </Field>
</template>

<style scoped>
/* .textarea-container:has(:focus-visible) {
  @apply outline-none ring-1 ring-teal-800;
} */
</style>
