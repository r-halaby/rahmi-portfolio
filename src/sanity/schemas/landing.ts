import { defineType, defineField } from "sanity";

const tile = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    description: "Cropped to a square on the landing page.",
  });

export const landing = defineType({
  name: "landing",
  title: "Landing",
  type: "document",
  fields: [
    tile("work", "Experience"),
    tile("writing", "Writing"),
    tile("photography", "Photography"),
    tile("reference", "Inspiration"),
    tile("futures", "Playspace"),
    tile("wish", "Projects I Wish I Made"),
  ],
  preview: {
    prepare: () => ({ title: "Landing" }),
  },
});
