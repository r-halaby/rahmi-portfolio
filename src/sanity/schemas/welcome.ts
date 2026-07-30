import { defineType, defineField } from "sanity";

export const welcome = defineType({
  name: "welcome",
  title: "Welcome (landing)",
  type: "document",
  fields: [
    defineField({
      name: "videoFile",
      title: "Video file",
      description: "Uploaded video. If both file and embed URL are set, the file wins.",
      type: "file",
      options: { accept: "video/*" },
    }),
    defineField({
      name: "videoEmbedUrl",
      title: "Video embed URL",
      description: "YouTube or Vimeo link. Used only when no video file is uploaded.",
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
      name: "resumeFile",
      title: "Resume (PDF)",
      type: "file",
      options: { accept: "application/pdf" },
    }),
  ],
  preview: { prepare: () => ({ title: "Welcome (landing)" }) },
});
