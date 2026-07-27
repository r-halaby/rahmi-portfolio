import { defineType, defineField, defineArrayMember } from "sanity";

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
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
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
      rows: 4,
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      description:
        "Images that scroll horizontally under the description.",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
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
