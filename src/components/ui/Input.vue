<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ErrorMessage, Field } from "vee-validate";
import { ref } from "vue";

export interface InputProps {
  type?: HTMLInputElement["type"];
  autocomplete?: string;
  label?: string;
  name: string;
  disabled?: boolean;
  isValid?: boolean;
  required?: boolean;
}
const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  required: true,
});

const model = defineModel();

const reactiveType = ref(props.type);
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
        class="relative flex border rounded-lg py-2.5 px-4 font-medium items-center input-container bg-neutral-0 border-neutral-400 transition-colors focus-within:border-teal-700 dark:bg-neutral-dark-800 dark:border-neutral-dark-500 dark:focus-within:border-neutral-dark-300"
        :class="{
          'text-green-600': isValid,
          'text-red-600 border-red-600 dark:border-red-600': meta.touched && !meta.valid,
        }"
      >
        <input
          :autocomplete
          v-bind="{ ...field, ...$attrs }"
          :name
          :disabled
          :type="reactiveType"
          :class="{
            'bg-green-600': isValid,
          }"
          class="flex-1 border-0 bg-transparent outline-none text-neutral-900 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-dark-0 dark:placeholder:text-neutral-dark-100/60"
        />
        <div
          :class="{
            error: meta.touched && !meta.valid,
          }"
          class="flex justify-center items-center h-full"
        >
          <slot name="suffix">
            <button
              type="button"
              v-if="type === 'password'"
              class="cursor-pointer text-neutral-500 dark:text-neutral-dark-100"
            >
              <Icon
                v-if="reactiveType === 'password'"
                @click="reactiveType = 'text'"
                icon="lucide:eye"
              />
              <Icon
                v-else
                @click="reactiveType = 'password'"
                icon="lucide:eye-off"
              />
            </button>
          </slot>
        </div>
      </div>
      <slot v-if="!errorMessage" name="helper" class="font-medium"></slot>
      <ErrorMessage :name class="font-medium text-red-600" />
    </label>
  </Field>
</template>
<style scoped>
.valid {
}

.error {
  color: var(--color-red-600);
}

.input-container:has(:focus-visible) {
  @apply outline-none;
}
</style>
