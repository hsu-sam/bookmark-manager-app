import { ref } from "vue";
import { supabase } from "@/utils/supabase";
import { UNCATEGORIZED_FOLDER_ID } from "@/types/folder";
import type {
  Bookmark,
  AddBookmarkPayload,
  UpdateBookmarkPayload,
} from "@/types/bookmark";
import type { BookmarkSortOption } from "@/composables/useBookmarkSort";

const DUPLICATE_URL_MESSAGE = "This URL already exists in your bookmarks.";

const loading = ref(false);
const error = ref<string | null>(null);

// Bumped after any mutation so list views (which each hold only their own
// current page) know to refetch. See useBookmarkList.ts.
export const bookmarksVersion = ref(0);
export function bumpBookmarksVersion() {
  bookmarksVersion.value += 1;
}
const bumpVersion = bumpBookmarksVersion;

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
  error: string | null;
}

async function listBookmarks(
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
    // PostgREST's `.or()` treats "," as a filter separator and reserves a
    // handful of other characters; wrapping the value in double quotes
    // escapes them, but the value itself can't contain a literal comma.
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

  return {
    data: err ? [] : ((data ?? []) as Bookmark[]),
    count: err ? 0 : (count ?? 0),
    error: err?.message ?? null,
  };
}

async function findDuplicateBookmark(
  url: string,
  excludeId?: string,
): Promise<Bookmark | null> {
  if (!url.trim()) return null;

  const { data, error: err } = await supabase.rpc("find_duplicate_bookmark", {
    p_url: url,
    p_exclude_id: excludeId ?? null,
  });

  if (err) return null;
  return (data as Bookmark | null) ?? null;
}

export function useBookmarks() {
  const addBookmark = async (payload: AddBookmarkPayload) => {
    loading.value = true;
    error.value = null;

    if (await findDuplicateBookmark(payload.url)) {
      error.value = DUPLICATE_URL_MESSAGE;
      loading.value = false;
      return null;
    }

    const { data, error: err } = await supabase
      .from("bookmarks")
      .insert([payload])
      .select("*")
      .single();

    loading.value = false;

    if (err) {
      error.value =
        err.code === "23505" ? DUPLICATE_URL_MESSAGE : err.message;
      return null;
    }

    bumpVersion();
    return data as Bookmark;
  };

  const updateBookmark = async (id: string, payload: UpdateBookmarkPayload) => {
    loading.value = true;
    error.value = null;

    if (payload.url && (await findDuplicateBookmark(payload.url, id))) {
      error.value = DUPLICATE_URL_MESSAGE;
      loading.value = false;
      return null;
    }

    const { data, error: err } = await supabase
      .from("bookmarks")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    loading.value = false;

    if (err) {
      error.value =
        err.code === "23505" ? DUPLICATE_URL_MESSAGE : err.message;
      return null;
    }

    bumpVersion();
    return data as Bookmark;
  };

  const togglePin = async (id: string, isPinned: boolean) => {
    return updateBookmark(id, { is_pinned: !isPinned });
  };

  const archiveBookmark = async (id: string) => {
    return updateBookmark(id, { is_archived: true });
  };

  const unarchiveBookmark = async (id: string) => {
    return updateBookmark(id, { is_archived: false });
  };

  const deleteBookmark = async (id: string) => {
    loading.value = true;
    error.value = null;

    const { error: err } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    loading.value = false;

    if (err) {
      error.value = err.message;
      return false;
    }

    bumpVersion();
    return true;
  };

  const recordVisit = async (id: string) => {
    const { data, error: err } = await supabase.rpc(
      "increment_bookmark_visit",
      { bookmark_id: id },
    );

    if (err) {
      error.value = err.message;
      return null;
    }

    bumpVersion();
    return data as Bookmark;
  };

  return {
    loading,
    error,
    listBookmarks,
    findDuplicateBookmark,
    addBookmark,
    updateBookmark,
    togglePin,
    archiveBookmark,
    unarchiveBookmark,
    deleteBookmark,
    recordVisit,
  };
}
