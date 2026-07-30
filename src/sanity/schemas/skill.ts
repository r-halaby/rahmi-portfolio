import { defineType, defineField } from "sanity";
import { galleryMembers } from "./gallery-members";

export const skill = defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: "Must exactly match the label used on the landing (e.g. 'Brand leadership').",
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
    }),
    defineField({
      name: "body",
      title: "Overview",
      description:
        "Brief overview shown at the top of the skill modal. Lead with a specific moment or project.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      description:
        "Images, uploaded videos, or embedded media (YouTube, Vimeo, SoundCloud, Instagram).",
      type: "array",
      of: galleryMembers(),
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
