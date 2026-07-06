<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { useRouter } from "vue-router";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import { useAuth } from "@/composables/useAuth";
import { useToast } from "@/composables/useToast";
import {
  emailRule,
  passwordRule,
  requiredRule,
} from "@/schemas/password.schemas";

const router = useRouter();
const { signUp } = useAuth();
const toast = useToast();

const loading = ref(false);

const { handleSubmit } = useForm({
  validationSchema: {
    fullName: requiredRule("Full name"),
    email: emailRule,
    password: passwordRule,
  },
});

const onSubmit = handleSubmit(async (values) => {
  loading.value = true;
  const { data, error } = await signUp(
    values.email as string,
    values.password as string,
    values.fullName as string,
  );
  loading.value = false;

  if (error) {
    toast.error(error.message);
    return;
  }

  if (data.session) {
    router.push({ path: "/u" });
    return;
  }

  toast.success("Check your email to confirm your account.");
  router.push({ name: "auth.signin" });
});
</script>

<template>
  <div
    class="flex flex-col gap-400 px-250 py-400 md:px-400 md:py-500 bg-neutral-0 rounded-12 md:w-md"
  >
    <img src="/logo-light-theme.svg" alt="logo bookmark" class="w-53.5" />
    <div class="flex flex-col gap-075">
      <h1>Create your accouunt</h1>
      <p>
        Join us and start saving your favorite links - organized, searchable,
        and always within reach.
      </p>
    </div>

    <form class="flex flex-col gap-200" @submit="onSubmit">
      <Input name="fullName" label="Full Name" type="text" class="w-full" />
      <Input name="email" label="Email" type="email" class="w-full" />
      <Input name="password" label="Password" type="password" class="w-full" />
      <Button
        type="submit"
        class="w-full justify-center"
        :loading="loading"
        :disabled="loading"
        >Create account
      </Button>
    </form>

    <div class="flex flex-col items-center gap-150">
      <p>
        Already have an account?
        <router-link
          to="/"
          class="text-neutral-900 font-semibold hover:underline"
          >Log in</router-link
        >
      </p>
    </div>
  </div>
</template>
