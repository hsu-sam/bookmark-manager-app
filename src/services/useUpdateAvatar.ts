import { ref } from "vue";
import { supabase } from "@/utils/supabase";

export function useUpdateAvatar() {
  const isLoading = ref(false);

  async function updateAvatar(imageUrl: string) {
    isLoading.value = true;

    const { data, error } = await supabase.auth.updateUser({
      data: { avatar_url: imageUrl },
    });

    isLoading.value = false;

    if (error) {
      return {
        success: false,
        message: error.message,
        data: null,
      };
    }

    return {
      success: true,
      message: "Avatar updated successfully.",
      data,
    };
  }

  return {
    isLoading,
    updateAvatar,
  };
}
