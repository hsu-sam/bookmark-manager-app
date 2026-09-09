<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import { requiredRule } from "@/schemas/bookmark.schemas.ts";
import { useAuth } from "@/services/useAuth";

const { signIn } = useAuth();
const isSubmitting = ref(false);
const errorMessage = ref<string | null>(null);

const { handleSubmit } = useForm({
  validationSchema: {
    email: requiredRule("Email"),
    password: requiredRule("Password"),
  },
});

const onSubmit = handleSubmit(async (values) => {
  isSubmitting.value = true;
  errorMessage.value = null;

  const { error } = await signIn(values.email, values.password);

  isSubmitting.value = false;
  if (error) {
    errorMessage.value = error.message;
  }
});
</script>

<template>
  <form class="flex flex-col gap-250" @submit="onSubmit">
    <div class="flex flex-col gap-050">
      <h2>Log in</h2>
      <p class="text-neutral-600 dark:text-neutral-dark-100">
        Log in to save bookmarks from any page.
      </p>
    </div>

    <Input name="email" label="Email" type="email" autocomplete="email" class="w-full" />
    <Input
      name="password"
      label="Password"
      type="password"
      autocomplete="current-password"
      class="w-full"
    />

    <div
      v-if="errorMessage"
      class="rounded-lg border border-red-600/40 bg-red-50 px-150 py-125 text-preset-4 text-red-800 dark:bg-red-950/40 dark:text-red-200"
    >
      {{ errorMessage }}
    </div>

    <Button type="submit" :loading="isSubmitting" class="w-full justify-center">
      Log in
    </Button>
  </form>
</template>
