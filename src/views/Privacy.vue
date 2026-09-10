<script setup lang="ts">
import ThemeLogo from "@/components/ThemeLogo.vue";
</script>

<template>
  <div
    class="min-h-screen bg-neutral-100 dark:bg-neutral-dark-900 px-200 py-400"
  >
    <div class="mx-auto flex max-w-180 flex-col gap-300">
      <RouterLink to="/"><ThemeLogo class="h-8 w-auto" /></RouterLink>

      <div class="flex flex-col gap-200">
        <h1>Privacy Policy</h1>
        <p class="text-neutral-600 dark:text-neutral-dark-100">
          Last updated: September 2026
        </p>
      </div>

      <div class="flex flex-col gap-300">
        <section class="flex flex-col gap-100">
          <h3>What Bookmark Manager stores</h3>
          <p>
            When you create an account and save bookmarks, we store your email
            address, your bookmarks (title, URL, description, tags, and folder),
            and basic usage data such as visit counts — all tied to your account
            and visible only to you.
          </p>
        </section>

        <section class="flex flex-col gap-100">
          <h3>What the browser extension accesses</h3>
          <p>
            The Bookmark Manager extension reads the current tab's title, URL,
            page description, and favicon only when you click the extension icon
            to save a bookmark. It does not run in the background, does not
            track the pages you browse, and does not read tab content on any
            page you haven't explicitly clicked "save" on.
          </p>
        </section>

        <!-- <section class="flex flex-col gap-100">
          <h3>How your data is stored</h3>
          <p>
            Your account and bookmarks are stored in our Supabase-hosted
            database with row-level security enabled, meaning only you can read
            or modify your own data. The extension keeps your sign-in session in
            your browser's local extension storage; the web app keeps it in your
            browser's local storage. Neither is accessible to other websites or
            other users.
          </p>
        </section> -->

        <section class="flex flex-col gap-100">
          <h3>Third-party services</h3>
          <p>
            We use Supabase for authentication and data storage, and Iconify's
            public icon API to render interface icons (no personal data is sent
            to Iconify). We do not sell your data, show ads, or share your
            bookmarks with anyone else.
          </p>
        </section>

        <section class="flex flex-col gap-100">
          <h3>Deleting your data</h3>
          <p>
            You can delete individual bookmarks or folders at any time from
            within the app. To request full account deletion, contact us at the
            email below.
          </p>
        </section>

        <section class="flex flex-col gap-100">
          <h3>Contact</h3>
          <p>
            Questions about this policy or your data? Email
            <a
              href="mailto:samuelhounsouu@gmail.com"
              class="text-teal-700 dark:text-neutral-dark-300 underline"
              >samuelhounsouu@gmail.com</a
            >.
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
