import { ref } from "vue";
import { supabase } from "@/utils/supabase";
import { isValidUrl } from "@/utils/url";

export type UrlMetadata = {
  title: string | null;
  description: string | null;
  faviconUrl: string | null;
};

export function useFetchMetadata() {
  const isFetchingMetadata = ref(false);

  async function fetchMetadata(url: string): Promise<UrlMetadata | null> {
    if (!isValidUrl(url)) return null;

    isFetchingMetadata.value = true;

    const { data, error } = await supabase.functions.invoke("fetch-url-metadata", {
      body: { url },
    });

    isFetchingMetadata.value = false;

    if (error || data?.error) {
      return null;
    }

    return data as UrlMetadata;
  }

  return {
    isFetchingMetadata,
    fetchMetadata,
  };
}
