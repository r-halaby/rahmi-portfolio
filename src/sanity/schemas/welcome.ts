import { defineType, defineField } from "sanity";

export const welcome = defineType({
  name: "welcome",
  title: "Welcome (landing)",
  type: "document",
  fields: [
    defineField({
      name: "videoFile",
      title: "Video file",
      description:
        "Uploaded video. If both file and embed URL are set, the file wins.",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "videoEmbedUrl",
      title: "Video embed URL",
      description:
        "YouTube or Vimeo link. Used only when no video file is uploaded.",
      type: "url",
    }),
    defineField({
      name: "portfolioUrl",
      title: "Portfolio URL",
      description: "e.g. https://rahmihalaby.com",
      type: "url",
    }),
    defineField({
      name: "loomUrl",
      title: "Loom URL",
      type: "url",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "email",
      title: "Email address",
      description: "Used for the EMAIL link (opens mailto:).",
      type: "string",
    }),
  ],
  preview: { prepare: () => ({ title: "Welcome (landing)" }) },
});
