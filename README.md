# Bookmark Manager App

A personal bookmark manager web application for saving, organizing, and revisiting your favorite links. Built with Vue 3, Supabase, and Tailwind CSS.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [Browser extension](#browser-extension)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Sign up, sign in, reset their password, and access protected routes
- Add, edit, delete, pin, and archive bookmarks
- Organize bookmarks into folders and filter them by tags
- Search bookmarks by title, URL, or tags
- Sort bookmarks by recently added, most visited, or recently visited
- Auto-fill bookmark details from a URL using metadata fetching
- Avoid saving duplicate URLs
- Track visit count and last visited date for each bookmark
- Use keyboard shortcuts (`A` to add, `/` to search)
- Save the page they're currently on straight from the browser toolbar, via a companion Chrome extension
- Switch between light and dark themes
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Screenshot

![](./public/preview.png)

### Links

- Solution URL: [https://github.com/hsu-sam/bookmark-manager-app](https://github.com/hsu-sam/bookmark-manager-app)
- Live Site URL: [Bookmark Manager App](https://bookmarkk-manager-app.vercel.app)
- Privacy Policy: [/privacy](https://bookmark-app.brimble.app/privacy)

## Browser extension

A Manifest V3 Chrome extension lives in [`extension/`](./extension) so you can save the page you're on without opening the web app: click the toolbar icon, and it pre-fills the title, description, and favicon (read directly from the page, with the `fetch-url-metadata` Edge Function as a fallback), lets you pick a folder and tags, and saves straight to your existing account — same Supabase tables, RLS, and duplicate-detection as the web app.

**Build it:**

```bash
pnpm run build:extension
```

This outputs to `dist-extension/`. Load it in Chrome via `chrome://extensions` → enable Developer mode → "Load unpacked" → select `dist-extension/`.

**How it's wired up:**

- `vite.extension.popup.config.ts` builds the popup UI (reuses the app's real `Input`/`Button`/`Textarea` components and `useBookmark`/`useFolder`/`useFetchMetadata` services via a path alias) and `vite.extension.content.config.ts` builds the on-page metadata scraper as a standalone script, since Chrome can't inject ES modules via `chrome.scripting.executeScript`.
- The extension has its own Supabase client (`extension/src/lib/supabase.ts`) backed by `chrome.storage.local` instead of `localStorage`, since a `chrome-extension://` popup can't read the web app's session.
- Permissions are intentionally minimal: `activeTab` + `scripting` (read the current tab only when you click the icon, never in the background) and `storage` (keep you signed in).

Not yet published to the Chrome Web Store — see the "Get the browser extension" link in the profile menu once it is.

## My process

### Built with

- TypeScript
- Tailwind CSS
- Mobile-first workflow
- Vue 3 (https://vuejs.org/) - JS framework
- Vite (https://vite.dev/) - Build tool
- Supabase (https://supabase.com/) - Auth, database, and Edge Functions
- Vue Router (https://router.vuejs.org/) - Client-side routing
- VeeValidate (https://vee-validate.logaretm.com/) - Form validation
- Radix Vue (https://www.radix-vue.com/) - Accessible UI primitives
- Iconify (https://iconify.design/) - Icons
- Chrome Extensions (Manifest V3) - Companion browser extension for quick-saving bookmarks

### What I learned

I learned how to build a full-stack web app with Vue 3 and Supabase — from setting up authentication and row-level security to organizing composables, services, and reusable UI components. I also explored URL normalization for duplicate detection, metadata fetching with Edge Functions, and keyboard shortcuts for a smoother user experience.

Building the browser extension pushed this further: reusing the web app's real components and services from a separate Manifest V3 build (via a scoped Vite alias so the extension gets its own `chrome.storage`-backed Supabase client without touching the shared code), reading page metadata straight from the DOM through `chrome.scripting.executeScript`, and running Tailwind CSS correctly across two independent Vite builds sharing one source tree.

### Continued development

I want to keep improving this project by strengthening my Vue and Supabase skills, adding better animations, improving SEO and web accessibility, and making the folder and tag workflows even more flexible. Next up for the extension: publishing it to the Chrome Web Store, and a Firefox build.

### Useful resources

- [Vue.js Documentation](https://vuejs.org/) - Helped me understand Vue 3 composition API, reactivity, and component patterns.
- [Supabase Documentation](https://supabase.com/docs) - Useful for auth, database setup, RLS policies, and Edge Functions.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Helped me build a responsive, theme-aware UI quickly.

## Author

- Website - [Samuel Hounsou](https://github.com/hsu-sam)
- GitHub - [@hsu-sam](https://github.com/hsu-sam)

## Acknowledgments

A big thanks to Frontend mentor for their impacts on us developer looking for a way to upskill. Projects like this are a great way to practice real-world full-stack development and improve problem-solving skills.
