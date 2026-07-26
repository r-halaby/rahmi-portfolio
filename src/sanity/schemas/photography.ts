import { defineType, defineField } from "sanity";

export const photography = defineType({
  name: "photography",
  title: "Photography",
  type: "document",
  fields: [
    defineField({
      name: "description",
      title: "Description",
      description: "Shown in the lower-right corner of the photography page.",
      type: "text",
      rows: 3,
    }),
  ],
  preview: { prepare: () => ({ title: "Photography" }) },
});
