import { defineArrayMember, defineField } from "sanity";

export function galleryMembers() {
  return [
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
    }),
    defineArrayMember({
      type: "object",
      name: "video",
      title: "Video",
      fields: [
        defineField({
          name: "file",
          title: "Video file",
          type: "file",
          options: { accept: "video/*" },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "poster",
          title: "Poster image (optional)",
          type: "image",
        }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
      preview: {
        select: { title: "caption", filename: "file.asset.originalFilename" },
        prepare: ({ title, filename }) => ({
          title: title || filename || "Video",
        }),
      },
    }),
    defineArrayMember({
      type: "object",
      name: "embed",
      title: "Embed",
      fields: [
        defineField({
          name: "url",
          title: "URL",
          description: "YouTube, Vimeo, SoundCloud, or Instagram link.",
          type: "url",
          validation: (Rule) => Rule.required(),
        }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
      preview: {
        select: { title: "url", subtitle: "caption" },
        prepare: ({ title, subtitle }) => ({
          title: title || "Embed",
          subtitle: subtitle ?? undefined,
        }),
      },
    }),
  ];
}
