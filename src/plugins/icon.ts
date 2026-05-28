import { addCollection } from "@iconify/vue";
import type { Plugin } from "vue";

export const icon: Plugin = {
  install() {
    console.info("icon plugin loaded");

    const svgFiles = import.meta.glob<{ default: string }>(
      "../assets/icons/*.svg",
      {
        query: "?raw",
        eager: true,
      },
    );

    const localIcons: Record<
      string,
      { body: string; width: number; height: number }
    > = {};

    for (const path in svgFiles) {
      const name = path?.split("/")?.pop()?.replace(".svg", "");
      const width = Number(svgFiles[path]?.default.match(/width="(\d+)"/)?.[1]);
      const height = Number(
        svgFiles[path]?.default.match(/height="(\d+)"/)?.[1],
      );
      localIcons[name!] = {
        body: svgFiles[path]?.default!,
        // .replace(/<svg[^>]*>|<\/svg>/g, '')
        width,
        height,
      };
    }
    // console.log("Loaded local icons:", Object.keys(localIcons));
    addCollection({
      prefix: "local",
      icons: localIcons,
    });
  },
};
