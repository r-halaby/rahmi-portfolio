import { defineType, defineField } from "sanity";

export const talk = defineType({
  name: "talk",
  title: "Talk",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "speaker",
      title: "Speaker",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "annotation",
      title: "Annotation",
      description: "Why you included it. Not a review.",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
  ],
  preview: { select: { title: "title", subtitle: "speaker" } },
});
