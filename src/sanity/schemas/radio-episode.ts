import { defineType, defineField } from "sanity";

export const radioEpisode = defineType({
  name: "radioEpisode",
  title: "Radio Episode",
  type: "document",
  fields: [
    defineField({
      name: "episodeNumber",
      title: "Episode Number",
      type: "number",
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "audioFile",
      title: "Audio File",
      type: "file",
      options: { accept: "audio/*" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "airDate",
      title: "Air Date",
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
      title: "Episode, newest first",
      name: "episodeDesc",
      by: [{ field: "episodeNumber", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      episodeNumber: "episodeNumber",
      title: "title",
      media: "coverImage",
      airDate: "airDate",
    },
    prepare: ({ episodeNumber, title, media, airDate }) => ({
      title: `Ep. ${String(episodeNumber).padStart(3, "0")}${title ? ` — ${title}` : ""}`,
      subtitle: airDate,
      media,
    }),
  },
});
