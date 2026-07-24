import type { StructureResolver } from "sanity/structure";

const SINGLETON_TYPES = new Set(["now"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Now")
        .id("now")
        .child(
          S.editor()
            .id("now")
            .schemaType("now")
            .documentId("now"),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_TYPES.has(item.getId() ?? ""),
      ),
    ]);
