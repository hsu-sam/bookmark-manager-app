import type { ListBookmarksParams } from "./useBookmark";

// A query key is just an array TanStack Query uses as the cache's address --
// it compares keys structurally (deep equality), not by reference, so two
// components asking for the same key share one cached entry and one
// in-flight request. `invalidateQueries` also matches by PREFIX: invalidating
// `bookmarkKeys.all` (["bookmarks"]) marks every `bookmarkKeys.list(...)`
// entry stale, regardless of which page/filters it was fetched with.
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
