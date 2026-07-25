import { defineType, defineField } from "sanity";

export const movie = defineType({
  name: "movie",
  title: "Movie",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "director",
      title: "Director",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "annotation",
      title: "Annotation",
      description: "Why you included it. Not a review.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "url",
      title: "Letterboxd URL",
      type: "url",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
  ],
  preview: { select: { title: "title", subtitle: "director" } },
});
