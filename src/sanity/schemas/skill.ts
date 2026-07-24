import { defineType, defineField } from "sanity";

export const skill = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Design", value: "design" },
          { title: "Marketing", value: "marketing" },
          { title: "Engineering", value: "engineering" },
          { title: "Leadership", value: "leadership" },
          { title: "Writing", value: "writing" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      description:
        "Lead with a specific moment or project — not a generic summary.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "name", subtitle: "category" } },
});
