export const landingQuery = /* groq */ `
  *[_type == "landing" && _id == "landing"][0] {
    work, writing, photography, reference, futures, wish
  }
`;

export const skillsQuery = /* groq */ `
  *[_type == "skill"] {
    _id,
    name,
    body,
    gallery[] { ..., "caption": caption }
  }
`;

export const projectsArchiveQuery = /* groq */ `
  *[_type == "project"] | order(coalesce(year, 0) desc, title asc) {
    _id, title, "slug": slug.current, client, category, year
  }
`;

export const articlesArchiveQuery = /* groq */ `
  *[_type == "article"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id, title, publication, category, url, publishedAt
  }
`;

export const articleByIdQuery = /* groq */ `
  *[_type == "article" && _id == $id][0] {
    _id, title, publication, category, url, publishedAt, excerpt
  }
`;

export const publicationsQuery = /* groq */ `
  *[_type == "publication"] {
    _id, name, description, url
  }
`;

export const bioQuery = /* groq */ `
  *[_type == "bio" && _id == "bio"][0] {
    photo,
    body,
    education[] {
      institution, program, location, activities, coursework
    },
    clients[] { name, url },
    experience[] {
      company, role, startYear, endYear
    }
  }
`;

export const photographyQuery = /* groq */ `
  *[_type == "photography" && _id == "photography"][0] {
    description
  }
`;

export const photosQuery = /* groq */ `
  *[_type == "photo" && defined(image.asset)] | order(dateTaken desc) {
    _id,
    image {
      asset -> {
        url,
        metadata {
          dimensions { width, height, aspectRatio }
        }
      }
    },
    location,
    dateTaken,
    series,
    featured
  }
`;

export const referenceIntrosQuery = /* groq */ `
  *[_type == "inspiration" && _id == "inspiration"][0] {
    booksIntro, talksIntro, albumsIntro, mixesIntro, moviesIntro, softwareIntro, nonprofitsIntro
  }
`;

export const mixesQuery = /* groq */ `
  *[_type == "mix"] | order(title asc) {
    _id, title, url, annotation
  }
`;

export const moviesQuery = /* groq */ `
  *[_type == "movie"] | order(year desc, title asc) {
    _id, title, director, year, annotation, url
  }
`;

export const booksQuery = /* groq */ `
  *[_type == "book"] | order(coalesce(yearRead, 0) desc, title asc) {
    _id, title, author, yearRead, annotation, url
  }
`;

export const albumsQuery = /* groq */ `
  *[_type == "album"] | order(coalesce(year, 0) desc, title asc) {
    _id, title, artist, year, annotation, url
  }
`;

export const softwareQuery = /* groq */ `
  *[_type == "software"] | order(name asc) {
    _id, name, url
  }
`;

export const talksQuery = /* groq */ `
  *[_type == "talk"] | order(title asc) {
    _id, title, speaker, url, annotation
  }
`;

export const nonprofitsQuery = /* groq */ `
  *[_type == "nonprofit"] | order(name asc) {
    _id, name, url, oneLiner
  }
`;
