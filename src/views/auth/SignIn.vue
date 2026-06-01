<script setup>
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
</script>

<template>
  <div
    class="flex flex-col gap-400 px-250 py-400 md:px-400 md:py-500 bg-neutral-0 rounded-12 md:min-w-md"
  >
    <img src="/logo-light-theme.svg" alt="logo bookmark" class="w-53.5" />
    <div class="flex flex-col gap-075">
      <h1>Log in to your account</h1>
      <p>Welcome back! Please enter your details.</p>
    </div>

    <form action="" class="flex flex-col gap-200">
      <Input label="Email" type="email" class="w-full" />
      <Input label="Password" type="password" class="w-full" />
      <Button type="submit" class="w-full justify-center"> Log in </Button>
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
