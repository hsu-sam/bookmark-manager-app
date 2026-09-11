import { registerSW } from "virtual:pwa-register";
import { useToast } from "@/composables/useToast";

export function registerPwa() {
  registerSW({
    immediate: true,
    onOfflineReady() {
      useToast().success("Bookmark Manager is ready to work offline.");
    },
  });
}
