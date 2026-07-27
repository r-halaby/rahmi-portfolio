import { defineType, defineField } from "sanity";

export const volunteer = defineType({
  name: "volunteer",
  title: "Volunteer",
  type: "document",
  fields: [
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "cause",
      title: "Cause",
      description: "e.g. Arts and Culture, Education",
      type: "string",
    }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "endDate",
      title: "End date",
      description: "Leave blank for present.",
      type: "date",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: "Start date, newest first",
      name: "startDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      role: "role",
      organization: "organization",
      media: "logo",
    },
    prepare: ({ role, organization, media }) => ({
      title: `${role} · ${organization}`,
      media,
    }),
  },
});
