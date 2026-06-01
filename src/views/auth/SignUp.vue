<script setup>
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
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

    <form action="" class="flex flex-col gap-200">
      <Input label="Full Name" type="text" class="w-full" />
      <Input label="Email" type="email" class="w-full" />
      <Input label="Password" type="password" class="w-full" />
      <Button type="submit" class="w-full justify-center"
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
