import { ref } from "vue";
import { supabase } from "@/utils/supabase";
import type {
  Bookmark,
  AddBookmarkPayload,
  UpdateBookmarkPayload,
} from "@/types/home";

const bookmarks = ref<Bookmark[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

export function useBookmarks() {
  const fetchBookmarks = async () => {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) {
      error.value = err.message;
      bookmarks.value = [];
    } else {
      bookmarks.value = (data ?? []) as Bookmark[];
    }

    loading.value = false;
  };

  const addBookmark = async (payload: AddBookmarkPayload) => {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("bookmarks")
      .insert([payload])
      .select("*")
      .single();

    loading.value = false;

    if (err) {
      error.value = err.message;
      return null;
    }

    const newBookmark = data as Bookmark;
    bookmarks.value.unshift(newBookmark);

    return newBookmark;
  };

  const updateBookmark = async (
    id: string,
    payload: UpdateBookmarkPayload,
  ) => {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("bookmarks")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (err) {
      error.value = err.message;
      loading.value = false;
      return null;
    }

    const updatedBookmark = data as Bookmark;
    const index = bookmarks.value.findIndex((bookmark) => bookmark.id === id);
    if (index !== -1) {
      bookmarks.value[index] = updatedBookmark;
    }

    loading.value = false;

    return updatedBookmark;
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

  return {
    bookmarks,
    loading,
    error,
    fetchBookmarks,
    addBookmark,
    updateBookmark,
    togglePin,
    archiveBookmark,
    unarchiveBookmark,
  };
}
