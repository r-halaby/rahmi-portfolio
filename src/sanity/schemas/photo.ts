import { defineType, defineField } from "sanity";

export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "dateTaken",
      title: "Date taken",
      type: "date",
    }),
    defineField({
      name: "series",
      title: "Series",
      description: "Optional grouping (e.g. Brooklyn, Travel, Food).",
      type: "string",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Date taken, newest first",
      name: "dateDesc",
      by: [{ field: "dateTaken", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "location", subtitle: "dateTaken", media: "image" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Untitled",
      subtitle,
      media,
    }),
  },
});
