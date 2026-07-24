import { defineType, defineField } from "sanity";

export const now = defineType({
  name: "now",
  title: "Now",
  type: "document",
  fields: [
    defineField({
      name: "body",
      title: "Body",
      description: "What you're currently working on.",
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated at",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { subtitle: "updatedAt" },
    prepare: ({ subtitle }) => ({ title: "Now", subtitle }),
  },
});
