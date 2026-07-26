import { defineType, defineField } from "sanity";

export const article = defineType({
  name: "article",
  title: "Writing",
  type: "document",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      description: "Paste the article link. Title, publication, and date are auto-fetched.",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title (override)",
      description: "Only set if the auto-fetched title is wrong.",
      type: "string",
    }),
    defineField({
      name: "publication",
      title: "Publication (override)",
      description: "Only set if the auto-fetched publication is wrong.",
      type: "string",
    }),
    defineField({
      name: "publishedAt",
      title: "Published at (override)",
      description: "Only set if the auto-fetched date is wrong.",
      type: "date",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Your words — not the lede.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "category",
      title: "Category",
      description: "Free-text tag for the archive table (e.g. Essay, Note, Interview).",
      type: "string",
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
      title: "Published, newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "url" } },
});
