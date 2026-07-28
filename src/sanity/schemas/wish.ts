import { defineType, defineField } from "sanity";

export const wish = defineType({
  name: "wish",
  title: "Projects I Wish I Made",
  type: "document",
  fields: [
    defineField({
      name: "description",
      title: "Description",
      description: "Shown at the top of the /wish page.",
      type: "text",
      rows: 4,
    }),
  ],
  preview: { prepare: () => ({ title: "Projects I Wish I Made" }) },
});
