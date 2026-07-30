import { defineType, defineField } from "sanity";

export const future = defineType({
  name: "future",
  title: "Playspace project",
  type: "document",
  fields: [
    defineField({
      name: "url",
      title: "URL",
      description:
        "Optional. If provided, title and image are auto-fetched and the card links out.",
      type: "url",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Works in Progress", value: "active" },
          { title: "Shipped", value: "shipped" },
          { title: "Backlog", value: "aspirational" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title (override)",
      description: "Only set if the auto-fetched title is wrong.",
      type: "string",
    }),
    defineField({
      name: "coverImage",
      title: "Cover image (override)",
      description: "Only upload if you want to override the auto-fetched image.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      description: "Short blurb shown under the card.",
      type: "text",
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: "Status then title",
      name: "statusTitle",
      by: [
        { field: "status", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "status", url: "url" },
    prepare: ({ title, subtitle, url }) => ({
      title: title || url || "Untitled",
      subtitle,
    }),
  },
});
