import { defineType, defineField } from "sanity";

export const mix = defineType({
  name: "mix",
  title: "Mix",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "YouTube URL",
      type: "url",
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
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
  ],
  preview: { select: { title: "title", subtitle: "url" } },
});
