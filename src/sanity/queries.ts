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

export const rolesQuery = /* groq */ `
  *[_type == "role"] | order(coalesce(endDate, "9999-12-31") desc, startDate desc) {
    _id, title, company, logo, employmentType, workMode, location, startDate, endDate, description,
    gallery[] { ..., "caption": caption }
  }
`;

export const educationsQuery = /* groq */ `
  *[_type == "education"] | order(coalesce(startDate, "") desc) {
    _id, institution, logo, degree, fieldOfStudy, startDate, endDate, activities, coursework
  }
`;

export const volunteersQuery = /* groq */ `
  *[_type == "volunteer"] | order(coalesce(startDate, "") desc) {
    _id, role, organization, logo, cause, startDate, endDate, description
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
    photoCaption,
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
