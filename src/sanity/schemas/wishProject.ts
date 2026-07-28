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
      name: "projectDate",
      title: "Project date",
      description: "YYYY, YYYY-MM, or YYYY-MM-DD",
      type: "string",
      validation: (Rule) =>
        Rule.regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).error(
          "Use YYYY, YYYY-MM, or YYYY-MM-DD",
        ),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
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
  orderings: [
    {
      title: "Date, newest first",
      name: "dateDesc",
      by: [{ field: "projectDate", direction: "desc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "creator", media: "coverImage" } },
});
