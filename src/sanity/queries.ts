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
