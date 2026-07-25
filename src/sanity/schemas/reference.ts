import { defineType, defineField } from "sanity";

const intro = (name: string, title: string) =>
  defineField({
    name,
    title,
    description: "Brief description shown under the section heading.",
    type: "text",
    rows: 3,
  });

export const inspiration = defineType({
  name: "inspiration",
  title: "Inspiration",
  type: "document",
  fields: [
    intro("booksIntro", "Books intro"),
    intro("talksIntro", "Talks intro"),
    intro("albumsIntro", "Albums intro"),
    intro("mixesIntro", "Mixes intro"),
    intro("moviesIntro", "Movies intro"),
    intro("softwareIntro", "Software intro"),
    intro("nonprofitsIntro", "Nonprofits intro"),
  ],
  preview: { prepare: () => ({ title: "Inspiration" }) },
});
