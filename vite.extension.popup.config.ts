import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  root: fileURLToPath(new URL("./extension/src/popup", import.meta.url)),
  publicDir: fileURLToPath(new URL("./extension/public", import.meta.url)),
  envDir: fileURLToPath(new URL(".", import.meta.url)),
  base: "./",
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: [
      {
        find: "@/utils/supabase",
        replacement: fileURLToPath(new URL("./extension/src/lib/supabase.ts", import.meta.url)),
      },
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  build: {
    outDir: fileURLToPath(new URL("./dist-extension", import.meta.url)),
    emptyOutDir: true,
    rollupOptions: {
      input: fileURLToPath(new URL("./extension/src/popup/popup.html", import.meta.url)),
    },
  },
});
