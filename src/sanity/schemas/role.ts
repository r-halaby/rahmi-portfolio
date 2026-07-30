import { defineType, defineField, defineArrayMember } from "sanity";
import { galleryMembers } from "./gallery-members";

export const role = defineType({
  name: "role",
  title: "Experience Role",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Role",
      description: "e.g. Founder, Head of Creative",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "company",
      title: "Company",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Company logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "employmentType",
      title: "Employment type",
      type: "string",
      options: {
        list: [
          { title: "Full-time", value: "full-time" },
          { title: "Part-time", value: "part-time" },
          { title: "Contract", value: "contract" },
          { title: "Freelance", value: "freelance" },
          { title: "Internship", value: "internship" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "workMode",
      title: "Work mode",
      type: "string",
      options: {
        list: [
          { title: "On-site", value: "on-site" },
          { title: "Hybrid", value: "hybrid" },
          { title: "Remote", value: "remote" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "location",
      title: "Location",
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
      rows: 4,
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
      name: "titles",
      title: "Additional titles",
      description:
        "Extra positions at the same company. Adding any titles here renders this entry as a grouped company with each title (including the primary one above) as a sub-position.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "position",
          fields: [
            defineField({
              name: "title",
              title: "Role",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "employmentType",
              title: "Employment type",
              type: "string",
              options: {
                list: [
                  { title: "Full-time", value: "full-time" },
                  { title: "Part-time", value: "part-time" },
                  { title: "Contract", value: "contract" },
                  { title: "Freelance", value: "freelance" },
                  { title: "Internship", value: "internship" },
                ],
                layout: "radio",
              },
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
              description:
                "YYYY, YYYY-MM, or YYYY-MM-DD. Leave blank for present.",
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
              rows: 4,
            }),
            defineField({
              name: "gallery",
              title: "Gallery",
              type: "array",
              of: galleryMembers(),
            }),
          ],
          preview: {
            select: {
              title: "title",
              start: "startDate",
              end: "endDate",
            },
            prepare: ({ title, start, end }) => ({
              title,
              subtitle: `${start ?? ""} – ${end ?? "present"}`,
            }),
          },
        }),
      ],
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
      title: "title",
      company: "company",
      start: "startDate",
      end: "endDate",
      media: "logo",
    },
    prepare: ({ title, company, start, end, media }) => ({
      title: `${title} · ${company}`,
      subtitle: `${(start ?? "").slice(0, 7)} – ${end ? end.slice(0, 7) : "present"}`,
      media,
    }),
  },
});
