import type { ListBookmarksParams } from "./useBookmark";

export const bookmarkKeys = {
  all: ["bookmarks"] as const,
  list: (params: ListBookmarksParams) =>
    [...bookmarkKeys.all, "list", params] as const,
};

export const folderKeys = {
  all: ["folders"] as const,
};

export const folderCountKeys = {
  all: ["folder-counts"] as const,
  scoped: (archived: boolean) => [...folderCountKeys.all, archived] as const,
};

export const tagCountKeys = {
  all: ["tag-counts"] as const,
  scoped: (archived: boolean) => [...tagCountKeys.all, archived] as const,
};
