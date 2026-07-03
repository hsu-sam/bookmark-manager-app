<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import { useAuth } from "@/composables/useAuth";
import { useToast } from "@/composables/useToast";
import { emailRule } from "@/schemas/password.schemas";

const { sendPasswordReset } = useAuth();
const toast = useToast();

const loading = ref(false);

const { handleSubmit } = useForm({
  validationSchema: {
    email: emailRule,
  },
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  await sendPasswordReset(values.email as string);
  loading.value = false;
  // Always show the same message, whether or not the account exists,
  // to avoid leaking which emails are registered.
  toast.success(
    "If an account exists for that email, you'll receive a reset link shortly.",
  );
});
</script>

<template>
  <div
    class="flex flex-col gap-400 px-250 py-400 md:px-400 md:py-500 bg-neutral-0 rounded-12 md:min-w-md"
  >
    <img src="/logo-light-theme.svg" alt="logo bookmark" class="w-53.5" />
    <div class="flex flex-col gap-075">
      <h1>Forgot your Password?</h1>
      <p class="semibold">
        Enter your email address below and we'll send you a link to reset your
        password.
      </p>
    </div>

    <form class="flex flex-col gap-200" @submit="onSubmit">
      <Input name="email" label="Email" type="email" class="w-full" />

      <Button
        type="submit"
        class="w-full justify-center"
        :loading="loading"
        :disabled="loading"
      >
        Send reset link
      </Button>
    </form>

    <div class="flex flex-col items-center gap-150">
      <p>
        <router-link
          to="/"
          class="text-neutral-900 font-semibold hover:underline"
          >Back to login</router-link
        >
      </p>
    </div>
  </div>
</template>
