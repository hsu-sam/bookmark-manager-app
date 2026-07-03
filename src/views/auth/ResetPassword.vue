<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import { useAuth } from "@/composables/useAuth";
import { useToast } from "@/composables/useToast";
import { confirmPasswordRule, passwordRule } from "@/schemas/password.schemas";

const router = useRouter();
const { updatePassword } = useAuth();
const toast = useToast();

const loading = ref(false);

const { handleSubmit } = useForm({
  validationSchema: {
    newPassword: passwordRule,
    confirmPassword: confirmPasswordRule,
  },
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const { error } = await updatePassword(values.newPassword as string);
  loading.value = false;

  if (error) {
    toast.error(error.message);
    return;
  }

  router.push({ name: "auth.signin" });
});
</script>

<template>
  <div
    class="flex flex-col gap-400 px-250 py-400 md:px-400 md:py-500 bg-neutral-0 rounded-12 md:min-w-md"
  >
    <img src="/logo-light-theme.svg" alt="logo bookmark" class="w-53.5" />
    <div class="flex flex-col gap-075">
      <h1>Reset Your Password</h1>
      <p class="semibold">
        Enter your new password below. Make sure it's strong and secure.
      </p>
    </div>

    <form class="flex flex-col gap-200" @submit="onSubmit">
      <Input
        name="newPassword"
        label="New Password"
        type="password"
        class="w-full"
      />
      <Input
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        class="w-full"
      />

      <Button
        type="submit"
        class="w-full justify-center"
        :loading="loading"
        :disabled="loading"
      >
        Reset password
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
