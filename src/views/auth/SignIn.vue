<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import { useAuth } from "@/composables/useAuth";
import { useToast } from "@/composables/useToast";
import { emailRule, requiredRule } from "@/schemas/password.schemas";

const router = useRouter();
const { signIn } = useAuth();
const toast = useToast();

const loading = ref(false);

const { handleSubmit } = useForm({
  validationSchema: {
    email: emailRule,
    password: requiredRule("Password"),
  },
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const { error } = await signIn(
    values.email as string,
    values.password as string,
  );
  loading.value = false;

  if (error) {
    toast.error(error.message);
    return;
  }

  router.push({ name: "user.index" });
});
</script>

<template>
  <div
    class="flex flex-col gap-400 px-250 py-400 md:px-400 md:py-500 bg-neutral-0 rounded-12 md:min-w-md w-full"
  >
    <img
      src="/logo-light-theme.svg"
      alt="logo bookmark"
      class="w-53.5 mx-auto"
    />
    <div class="flex flex-col gap-075">
      <h1>Log in to your account</h1>
      <p>Welcome back! Please enter your details.</p>
    </div>

    <form class="flex flex-col gap-200" @submit="onSubmit">
      <Input name="email" label="Email" type="email" class="w-full" />
      <Input name="password" label="Password" type="password" class="w-full" />
      <Button
        type="submit"
        class="w-full justify-center"
        :loading="loading"
        :disabled="loading"
      >
        Log in
      </Button>
    </form>

    <div class="flex flex-col items-center gap-150">
      <p>
        Forgot password?
        <router-link
          to="/forgot-password"
          class="text-neutral-900 font-semibold hover:underline"
          >Reset it</router-link
        >
      </p>
      <p>
        Don't have an account?
        <router-link
          to="/signup"
          class="text-neutral-900 font-semibold hover:underline"
          >Sign up</router-link
        >
      </p>
    </div>
  </div>
</template>
