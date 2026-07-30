import { defineType, defineField } from "sanity";

export const wallpapers = defineType({
  name: "wallpapers",
  title: "Wallpapers",
  type: "document",
  fields: [
    defineField({
      name: "items",
      title: "Wallpapers",
      description: "Images available in the landing page wallpaper picker.",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "title",
              title: "Title (internal)",
              type: "string",
            },
          ],
        },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Wallpapers" }) },
});
