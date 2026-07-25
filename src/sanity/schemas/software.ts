import { defineType, defineField } from "sanity";

export const software = defineType({
  name: "software",
  title: "Software",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      description: "The tool's website. Used to fetch a favicon.",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
  ],
  preview: { select: { title: "name", subtitle: "url" } },
});
