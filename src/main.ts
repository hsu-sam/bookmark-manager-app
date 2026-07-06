import "./assets/main.css";
import { icon } from "../src/plugins/icon.ts";
import { createApp } from "vue";
import App from "./App.vue";
import { initTheme } from "./composables/useTheme";

import { router } from "./router";

initTheme();

createApp(App).use(router).use(icon).mount("#app");
