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
      queryClient.invalidateQueries({ queryKey: folderKeys.all });
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.all });
      queryClient.invalidateQueries({ queryKey: folderCountKeys.all });
    },
  });
}
