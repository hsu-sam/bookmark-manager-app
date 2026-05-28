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
        'flex flex-col gap-1.5 has-disabled:opacity-40 text-small',
        $attrs.class,
      ]"
    >
      <span class="font-semibold">
        {{ label }} <em class="text-red-500 not-italic" v-if="required">*</em>
      </span>

      <div
        class="relative flex border rounded-lg py-2.5 px-4 font-medium items-center input-container"
        :class="{
          'text-green-600': isValid,
          'text-error': meta.touched && !meta.valid,
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
            'border-error': meta.touched && !meta.valid,
          }"
          class="flex-1 focus-visible:outline-none"
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
              class="cursor-pointer"
            >
              <Icon
                v-if="reactiveType === 'password'"
                @click="reactiveType = 'text'"
                icon="lucide:eye"
                class="text-secondary-gray"
              />
              <Icon
                v-else
                @click="reactiveType = 'password'"
                icon="lucide:eye-off"
                class="text-secondary-gray"
              />
            </button>
          </slot>
        </div>
      </div>
      <slot v-if="!errorMessage" name="helper" class="font-medium"></slot>
      <ErrorMessage :name class="font-medium text-error" />
    </label>
  </Field>
</template>
<style scoped>
.valid {
}

.error {
}

.input-container:has(:focus-visible) {
  @apply outline-none;
}
</style>
