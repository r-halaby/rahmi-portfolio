import { defineType, defineField } from "sanity";

export const wishProject = defineType({
  name: "wishProject",
  title: "Wish Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "creator",
      title: "Creator",
      description: "Person or studio behind it.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "annotation",
      title: "Annotation",
      description: "Why you wish you made it — specific to you.",
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
  preview: { select: { title: "title", subtitle: "creator" } },
});
