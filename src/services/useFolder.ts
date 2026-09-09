import { computed } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { supabase } from "@/utils/supabase";
import type {
  Folder,
  CreateFolderPayload,
  UpdateFolderPayload,
} from "@/types/folder";
import { bookmarkKeys, folderCountKeys, folderKeys } from "./queryKeys";

async function fetchFolders(): Promise<Folder[]> {
  const { data, error: err } = await supabase
    .from("folders")
    .select("*")
    .order("name", { ascending: true });

  if (err) throw new Error(err.message);
  return (data ?? []) as Folder[];
}

// No module-level `ref` here anymore. Every component that calls
// useFolders() issues a useQuery with the SAME key (folderKeys.all), so
// TanStack Query dedupes them: the first caller triggers the fetch, every
// other caller just reads the shared cached result. That's what used to
// require the hand-rolled singleton ref pattern -- the cache itself is now
// the shared store.
export function useFolders() {
  const query = useQuery({
    queryKey: folderKeys.all,
    queryFn: fetchFolders,
  });

  const folders = computed(() => query.data.value ?? []);

  const getFolderById = (id: string) =>
    folders.value.find((folder) => folder.id === id) ?? null;

  return {
    folders,
    isLoading: query.isPending,
    error: computed(() => query.error.value?.message ?? null),
    getFolderById,
  };
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateFolderPayload) => {
      const { data, error: err } = await supabase
        .from("folders")
        .insert([
          { name: payload.name.trim(), parent_id: payload.parent_id ?? null },
        ])
        .select("*")
        .single();

      if (err) throw new Error(err.message);
      return data as Folder;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: folderKeys.all }),
  });
}

export function useUpdateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateFolderPayload;
    }) => {
      const { data, error: err } = await supabase
        .from("folders")
        .update(payload)
        .eq("id", id)
        .select("*")
        .single();

      if (err) throw new Error(err.message);
      return data as Folder;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: folderKeys.all }),
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error: err } = await supabase.from("folders").delete().eq("id", id);
      if (err) throw new Error(err.message);
    },
    onSuccess: () => {
      // Deleting a folder reaches into the bookmarks domain too (their
      // folder_id gets nulled server-side by the ON DELETE SET NULL FK), so
      // this invalidates across both -- a mutation's onSuccess is the right
      // place for that, not the component that happened to trigger it.
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({ queryKey: folderCountKeys.all });
    },
  });
}
