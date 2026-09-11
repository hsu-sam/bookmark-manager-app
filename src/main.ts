import "./assets/main.css";
import { icon } from "../src/plugins/icon.ts";
import { createApp } from "vue";
import { VueQueryPlugin } from "@tanstack/vue-query";
import App from "./App.vue";
import { initTheme } from "./composables/useTheme";
import { registerPwa } from "./composables/usePwa";
import { queryClient } from "./services/queryClient";

import { router } from "./router";

initTheme();
registerPwa();

createApp(App)
  .use(router)
  .use(icon)
  .use(VueQueryPlugin, { queryClient })
  .mount("#app");
