import { defineType, defineField } from "sanity";

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({
      name: "institution",
      title: "Institution",
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
      name: "degree",
      title: "Degree",
      description: "e.g. Bachelor's degree",
      type: "string",
    }),
    defineField({
      name: "fieldOfStudy",
      title: "Field of study",
      type: "string",
    }),
    defineField({
      name: "startDate",
      title: "Start date",
      description: "YYYY, YYYY-MM, or YYYY-MM-DD",
      type: "string",
      validation: (Rule) =>
        Rule.regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).error(
          "Use YYYY, YYYY-MM, or YYYY-MM-DD",
        ),
    }),
    defineField({
      name: "endDate",
      title: "End date",
      description: "YYYY, YYYY-MM, or YYYY-MM-DD",
      type: "string",
      validation: (Rule) =>
        Rule.regex(/^\d{4}(-\d{2}(-\d{2})?)?$/).error(
          "Use YYYY, YYYY-MM, or YYYY-MM-DD",
        ),
    }),
    defineField({
      name: "activities",
      title: "Activities and Societies",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "coursework",
      title: "Coursework Included",
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
      institution: "institution",
      degree: "degree",
      field: "fieldOfStudy",
      media: "logo",
    },
    prepare: ({ institution, degree, field, media }) => ({
      title: institution,
      subtitle: [degree, field].filter(Boolean).join(", "),
      media,
    }),
  },
});
