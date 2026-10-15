import { defineType, defineField } from "sanity";

export const art = defineType({
  name: "art",
  title: "Art",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "artist",
      title: "Artist",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year of creation",
      type: "number",
    }),
    defineField({
      name: "url",
      title: "URL",
      description: "Museum page, gallery link, etc. (optional).",
      type: "url",
    }),
    defineField({
      name: "coverImage",
      title: "Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "annotation",
      title: "Annotation",
      description: "Why you included it.",
      type: "text",
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: "Artist A–Z",
      name: "artistAsc",
      by: [{ field: "artist", direction: "asc" }],
    },
    {
      title: "Year, newest first",
      name: "yearDesc",
      by: [{ field: "year", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "artist", media: "coverImage" },
  },
});
