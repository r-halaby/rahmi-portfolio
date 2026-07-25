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

export const moviesQuery = /* groq */ `
  *[_type == "movie"] | order(year desc, title asc) {
    _id, title, director, year, annotation, url
  }
`;

export const booksQuery = /* groq */ `
  *[_type == "book"] | order(coalesce(yearRead, 0) desc, title asc) {
    _id, title, author, yearRead, annotation
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
