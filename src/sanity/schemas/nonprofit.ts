import { defineType, defineField } from "sanity";

export const nonprofit = defineType({
  name: "nonprofit",
  title: "Nonprofit",
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
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "oneLiner",
      title: "One-liner",
      description: "What they do and why you support them.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "name", subtitle: "oneLiner" } },
});
