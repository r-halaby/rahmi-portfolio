import { defineType, defineField } from "sanity";

export const book = defineType({
  name: "book",
  title: "Book",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "yearRead",
      title: "Year read",
      type: "number",
    }),
    defineField({
      name: "url",
      title: "URL",
      description: "Goodreads / Bookshop / publisher link (optional).",
      type: "url",
    }),
    defineField({
      name: "annotation",
      title: "Annotation",
      description: "Why you included it. Not a review.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
  ],
  preview: { select: { title: "title", subtitle: "author" } },
});
