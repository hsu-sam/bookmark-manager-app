import { ref } from "vue";
import { supabase } from "@/utils/supabase";
import type {
  Folder,
  CreateFolderPayload,
  UpdateFolderPayload,
} from "@/types/folder";

const folders = ref<Folder[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

export function useFolders() {
  const fetchFolders = async () => {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("folders")
      .select("*")
      .order("name", { ascending: true });

    if (err) {
      error.value = err.message;
      folders.value = [];
    } else {
      folders.value = (data ?? []) as Folder[];
    }

    loading.value = false;
  };

  const createFolder = async (payload: CreateFolderPayload) => {
    loading.value = true;
    error.value = null;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      error.value = "You must be signed in to create a folder.";
      loading.value = false;
      return null;
    }

    const { data, error: err } = await supabase
      .from("folders")
      .insert([
        {
          name: payload.name.trim(),
          parent_id: payload.parent_id ?? null,
          user_id: user.id,
        },
      ])
      .select("*")
      .single();

    loading.value = false;

    if (err) {
      error.value = err.message;
      return null;
    }

    const folder = data as Folder;
    folders.value = [...folders.value, folder].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    return folder;
  };

  const updateFolder = async (id: string, payload: UpdateFolderPayload) => {
    loading.value = true;
    error.value = null;

    const { data, error: err } = await supabase
      .from("folders")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    loading.value = false;

    if (err) {
      error.value = err.message;
      return null;
    }

    const updatedFolder = data as Folder;
    const index = folders.value.findIndex((folder) => folder.id === id);
    if (index !== -1) {
      folders.value[index] = updatedFolder;
      folders.value.sort((a, b) => a.name.localeCompare(b.name));
    }

    return updatedFolder;
  };

  const deleteFolder = async (id: string) => {
    loading.value = true;
    error.value = null;

    const { error: err } = await supabase.from("folders").delete().eq("id", id);

    loading.value = false;

    if (err) {
      error.value = err.message;
      return false;
    }

    folders.value = folders.value.filter((folder) => folder.id !== id);
    return true;
  };

  const getFolderById = (id: string) => {
    return folders.value.find((folder) => folder.id === id) ?? null;
  };

  return {
    folders,
    loading,
    error,
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    getFolderById,
  };
}
