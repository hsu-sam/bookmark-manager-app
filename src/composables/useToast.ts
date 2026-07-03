import { ref } from "vue";

export type ToastType = "success" | "error";

export interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

const toasts = ref<ToastItem[]>([]);
let nextId = 0;

function dismiss(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

function push(type: ToastType, message: string, duration = 4000) {
  const id = nextId++;
  toasts.value.push({ id, type, message });
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }
  return id;
}

export function useToast() {
  return {
    toasts,
    dismiss,
    success: (message: string, duration?: number) =>
      push("success", message, duration),
    error: (message: string, duration?: number) =>
      push("error", message, duration),
  };
}
