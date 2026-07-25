import type { StructureResolver } from "sanity/structure";

const SINGLETON_TYPES = new Set(["now", "landing", "bio", "inspiration"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Landing")
        .id("landing")
        .child(
          S.editor()
            .id("landing")
            .schemaType("landing")
            .documentId("landing"),
        ),
      S.listItem()
        .title("Bio")
        .id("bio")
        .child(
          S.editor().id("bio").schemaType("bio").documentId("bio"),
        ),
      S.listItem()
        .title("Now")
        .id("now")
        .child(
          S.editor().id("now").schemaType("now").documentId("now"),
        ),
      S.listItem()
        .title("Inspiration")
        .id("inspiration")
        .child(
          S.editor()
            .id("inspiration")
            .schemaType("inspiration")
            .documentId("inspiration"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? ""),
      ),
    ]);
