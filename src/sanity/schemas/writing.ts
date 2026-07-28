import { defineType, defineField } from "sanity";

export const writing = defineType({
  name: "writing",
  title: "Writing (page)",
  type: "document",
  fields: [
    defineField({
      name: "description",
      title: "Description",
      description: "Shown at the top of the /writing page.",
      type: "text",
      rows: 4,
    }),
  ],
  preview: { prepare: () => ({ title: "Writing (page)" }) },
});
