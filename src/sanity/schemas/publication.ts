import { defineType, defineField } from "sanity";

export const publication = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description:
        "Must match the publication name that appears on your articles (case-sensitive).",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "A brief sentence about the publication.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
  ],
  preview: { select: { title: "name", subtitle: "description" } },
});
