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
      description: "YYYY, YYYY-MM, or YYYY-MM-DD",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/)
          .error("Use YYYY, YYYY-MM, or YYYY-MM-DD"),
    }),
  ],
  preview: {
    select: { subtitle: "updatedAt" },
    prepare: ({ subtitle }) => ({ title: "Now", subtitle }),
  },
});
