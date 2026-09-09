import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { supabase } from "@/utils/supabase";
import { UNCATEGORIZED_FOLDER_ID } from "@/types/folder";
import type {
  Bookmark,
  AddBookmarkPayload,
  UpdateBookmarkPayload,
} from "@/types/bookmark";
import type { BookmarkSortOption } from "@/composables/useBookmarkSort";
import { bookmarkKeys, folderCountKeys, tagCountKeys } from "./queryKeys";

const DUPLICATE_URL_MESSAGE = "This URL already exists in your bookmarks.";

export interface ListBookmarksParams {
  archived: boolean;
  page: number;
  pageSize: number;
  search: string;
  folderId: string | null;
  tags: string[];
  sort: BookmarkSortOption;
}

export interface ListBookmarksResult {
  data: Bookmark[];
  count: number;
}

export async function listBookmarks(
  params: ListBookmarksParams,
): Promise<ListBookmarksResult> {
  let query = supabase
    .from("bookmarks")
    .select("*", { count: "exact" })
    .eq("is_archived", params.archived);

  if (params.folderId === UNCATEGORIZED_FOLDER_ID) {
    query = query.is("folder_id", null);
  } else if (params.folderId) {
    query = query.eq("folder_id", params.folderId);
  }

  if (params.tags.length) {
    query = query.contains("tags", params.tags);
  }

  const search = params.search.trim();
  if (search) {
    const safe = `"%${search.replace(/[,"]/g, " ")}%"`;
    query = query.or(
      `title.ilike.${safe},url.ilike.${safe},description.ilike.${safe}`,
    );
  }

  query = query.order("is_pinned", { ascending: false });
  if (params.sort === "most-visited") {
    query = query.order("visit_count", { ascending: false });
  } else if (params.sort === "recently-visited") {
    query = query.order("last_visited", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const start = (params.page - 1) * params.pageSize;
  const { data, count, error: err } = await query.range(
    start,
    start + params.pageSize - 1,
  );

  if (err) throw new Error(err.message);

  return { data: (data ?? []) as Bookmark[], count: count ?? 0 };
}

export async function findDuplicateBookmark(
  url: string,
  excludeId?: string,
): Promise<Bookmark | null> {
  if (!url.trim()) return null;

  const { data, error: err } = await supabase.rpc("find_duplicate_bookmark", {
    p_url: url,
    p_exclude_id: excludeId ?? null,
  });

  if (err) return null;
  return (data as Bookmark[] | null)?.[0] ?? null;
}

function invalidateBookmarkCaches(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
  queryClient.invalidateQueries({ queryKey: folderCountKeys.all });
  queryClient.invalidateQueries({ queryKey: tagCountKeys.all });
}

async function insertBookmark(payload: AddBookmarkPayload): Promise<Bookmark> {
  if (await findDuplicateBookmark(payload.url)) {
    throw new Error(DUPLICATE_URL_MESSAGE);
  }

  const { data, error: err } = await supabase
    .from("bookmarks")
    .insert([payload])
    .select("*")
    .single();

  if (err) {
    throw new Error(err.code === "23505" ? DUPLICATE_URL_MESSAGE : err.message);
  }

  return data as Bookmark;
}

async function patchBookmark(
  id: string,
  payload: UpdateBookmarkPayload,
): Promise<Bookmark> {
  if (payload.url && (await findDuplicateBookmark(payload.url, id))) {
    throw new Error(DUPLICATE_URL_MESSAGE);
  }

  const { data, error: err } = await supabase
    .from("bookmarks")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (err) {
    throw new Error(err.code === "23505" ? DUPLICATE_URL_MESSAGE : err.message);
  }

  return data as Bookmark;
}

async function removeBookmark(id: string): Promise<void> {
  const { error: err } = await supabase.from("bookmarks").delete().eq("id", id);
  if (err) throw new Error(err.message);
}

export function useAddBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: insertBookmark,
    onSuccess: () => invalidateBookmarkCaches(queryClient),
  });
}

export function useUpdateBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateBookmarkPayload }) =>
      patchBookmark(id, payload),
    onSuccess: () => invalidateBookmarkCaches(queryClient),
  });
}

export function useDeleteBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeBookmark,
    onSuccess: () => invalidateBookmarkCaches(queryClient),
  });
}

export function useTogglePinBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isPinned }: { id: string; isPinned: boolean }) =>
      patchBookmark(id, { is_pinned: !isPinned }),
    onSuccess: () => invalidateBookmarkCaches(queryClient),
  });
}

export function useArchiveBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patchBookmark(id, { is_archived: true }),
    onSuccess: () => invalidateBookmarkCaches(queryClient),
  });
}

export function useUnarchiveBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => patchBookmark(id, { is_archived: false }),
    onSuccess: () => invalidateBookmarkCaches(queryClient),
  });
}

export function useRecordBookmarkVisit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error: err } = await supabase.rpc(
        "increment_bookmark_visit",
        { bookmark_id: id },
      );
      if (err) throw new Error(err.message);
      return data as Bookmark;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: bookmarkKeys.all }),
  });
}
