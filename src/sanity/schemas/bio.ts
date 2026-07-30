import { defineType, defineField, defineArrayMember } from "sanity";

export const bio = defineType({
  name: "bio",
  title: "Bio",
  type: "document",
  fields: [
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "photoCaption",
      title: "Photo caption",
      description: "Small text shown below the photo (optional).",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      description: "Written bio. Paragraphs will render in order.",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "school",
          fields: [
            defineField({
              name: "institution",
              title: "Institution",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "program",
              title: "Program",
              type: "string",
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
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
          preview: {
            select: {
              institution: "institution",
              program: "program",
            },
            prepare: ({ institution, program }) => ({
              title: institution,
              subtitle: program,
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "clients",
      title: "Clients",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "client",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "url" },
          },
        }),
      ],
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "email",
      title: "Email",
      description: "Used for the mailto: link in the side panel.",
      type: "string",
    }),
    defineField({
      name: "experience",
      title: "Experience",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "role",
          fields: [
            defineField({
              name: "company",
              title: "Company",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "startYear",
              title: "Start year",
              type: "number",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "endYear",
              title: "End year",
              description: "Leave blank for present.",
              type: "number",
            }),
          ],
          preview: {
            select: {
              company: "company",
              role: "role",
              startYear: "startYear",
              endYear: "endYear",
            },
            prepare: ({ company, role, startYear, endYear }) => ({
              title: `${role} · ${company}`,
              subtitle: `${startYear} – ${endYear ?? "present"}`,
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Bio" }),
  },
});
