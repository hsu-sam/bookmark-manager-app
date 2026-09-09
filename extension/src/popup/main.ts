import "./popup.css";
import { createApp } from "vue";
import { VueQueryPlugin, QueryClient } from "@tanstack/vue-query";
import { initTheme } from "@/composables/useTheme";
import Popup from "./Popup.vue";

initTheme();

createApp(Popup)
  .use(VueQueryPlugin, { queryClient: new QueryClient() })
  .mount("#app");
