import { defineType, defineField } from "sanity";
import { galleryMembers } from "./gallery-members";

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
      description: "YYYY, YYYY-MM, or YYYY-MM-DD",
      type: "string",
      validation: (Rule) =>
        Rule.required()
          .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/)
          .error("Use YYYY, YYYY-MM, or YYYY-MM-DD"),
    }),
    defineField({
      name: "endDate",
      title: "End date",
      description: "YYYY, YYYY-MM, or YYYY-MM-DD. Leave blank for present.",
      type: "string",
      validation: (Rule) =>
        Rule.regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).error(
          "Use YYYY, YYYY-MM, or YYYY-MM-DD",
        ),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      description:
        "Images, uploaded videos, or embedded media (YouTube, Vimeo, SoundCloud, Instagram).",
      type: "array",
      of: galleryMembers(),
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
