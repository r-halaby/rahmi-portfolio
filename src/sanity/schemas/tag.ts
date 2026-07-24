import { defineType, defineField } from "sanity";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "label", maxLength: 64 },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "label", subtitle: "slug.current" } },
});
