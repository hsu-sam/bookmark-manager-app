import { onMounted, onUnmounted } from "vue";

type ShortcutHandler = () => void;

interface KeyboardShortcutOptions {
  onAdd?: ShortcutHandler;
  onFocusSearch?: ShortcutHandler;
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;

  return target.isContentEditable;
}

function isDialogOpen() {
  return Boolean(
    document.querySelector('[role="dialog"][data-state="open"]'),
  );
}

export function useKeyboardShortcuts(options: KeyboardShortcutOptions) {
  function handleKeydown(event: KeyboardEvent) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (isTypingTarget(event.target)) return;
    if (isDialogOpen()) return;

    if (event.key === "/" && options.onFocusSearch) {
      event.preventDefault();
      options.onFocusSearch();
      return;
    }

    if ((event.key === "a" || event.key === "A") && options.onAdd) {
      event.preventDefault();
      options.onAdd();
    }
  }

  onMounted(() => {
    window.addEventListener("keydown", handleKeydown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeydown);
  });
}
